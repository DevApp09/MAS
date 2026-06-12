using MAS.Authentications;
using MAS.DataAccessLayer.UnitOfWork;
using MAS.DataTransferObject;
using MAS.BusinessLogicLayer;
using MAS.Exceptions;
using MAS.InversionOfControl;
using MAS.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MAS.BusinessLogicLayer.Contract;
using System.Web.Script.Serialization;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using System.Threading.Tasks;
//using OfficeOpenXml;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using System.Text;

namespace MAS.Web
{
    public partial class FileTransmissionEndPoint : System.Web.UI.Page
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;
        //private readonly IDriveDataBLL _driveData;

        public FileTransmissionEndPoint()
        {
            _configuration = IOC.Resolve<IConfiguration>();
            _logger = IOC.Resolve<ILogger>();
            //_driveData = IOC.Resolve<IDriveDataBLL>();
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            {
                string uploadedFileLocation = null;
                var requestType = string.Empty;
                try
                {
                    var data2 = (HttpContext.Current.Items["StrongTypeSession"] as IUserInfo);
                    CallContext.LogicalSetData("StrongTypeSession", data2);

                    var unitOfWork = IOC.Resolve<IUnitOfWork>();
                    Response.Clear();
                    var fileName = string.Empty;

                    requestType = Request.QueryString.Count > 0 ? Request.QueryString[0] : string.Empty;

                    if (requestType.Equals("ExportResponse", StringComparison.OrdinalIgnoreCase))
                    {
                        long surveyId = Convert.ToInt64(Request.QueryString[1]);
                        ExportResponse(surveyId);
                    }
                    else if (requestType.Equals("ImportResponseTemplate", StringComparison.OrdinalIgnoreCase))
                    {
                        long surveyId = Convert.ToInt64(Request.QueryString[1]);
                        ImportResponseTemplate(surveyId);
                    }
                    else if (requestType.Equals("ImportResponse", StringComparison.OrdinalIgnoreCase))
                    {
                        long surveyId = Convert.ToInt64(Request.QueryString[1]);
                        //int createdBy = Convert.ToInt32(Request.QueryString[2]);
                        int createdBy = 1;
                        ImportResponse(surveyId, createdBy);
                    }
                }
                catch (ThreadAbortException) { }
                catch (BLLException ex)
                {
                    if (File.Exists(uploadedFileLocation))
                    {
                        File.Delete(uploadedFileLocation);
                    }
                    Response.Write(ServiceResponse.GetErrorResponse(ErrorClass.BLL, ex.Message, null));
                }
                catch (Exception ex)
                {
                    if (File.Exists(uploadedFileLocation))
                    {
                        File.Delete(uploadedFileLocation);
                    }
                    _logger.Error("An unexpected error has occured while uploading file", ex);
                    Response.Write(ServiceResponse.GetErrorResponse(ErrorClass.General, "An unexpected error has occured", null));
                }


                try
                {
                    Response.Flush();
                    Response.End();
                }
                catch (ThreadAbortException) { }
            }
        }
        private void ExportResponse(long surveyId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["MASConnectionString"].ToString();
            var query = "SP_SurveyResponse_Export";
            var parameters = new SqlParameter[]
                {
                    new SqlParameter("@SurveyId", surveyId){SqlDbType = SqlDbType.Int},
                };

            var dataTable = SqlHelper.GetDataTableFromSP(connectionString, query, parameters);

            string fileName = "SurveyResponse_Export.xls";
            StringWriter tw = new StringWriter();
            HtmlTextWriter hw = new HtmlTextWriter(tw);
            DataGrid dgGrid = new DataGrid();
            dgGrid.DataSource = dataTable;
            dgGrid.DataBind();

            //Get the HTML for the control.
            dgGrid.RenderControl(hw);
            //Write the HTML back to the browser.
            //Response.ContentType = application/vnd.ms-excel;
            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName + "");
            this.EnableViewState = false;
            Response.Write(tw.ToString());
            Response.End();
        }
        private void ImportResponseTemplate(long surveyId)
        {
            using (var workbook = new XLWorkbook())
            {
                var connectionString = ConfigurationManager.ConnectionStrings["MASConnectionString"].ToString();
                var query = "SP_SurveyResponse_ImportTemplate";
                var parameters = new SqlParameter[]
                {
        new SqlParameter("@SurveyId", surveyId) { SqlDbType = SqlDbType.Int }
                };

                var dataTable = SqlHelper.GetDataTableFromSP(connectionString, query, parameters);

                var worksheet = workbook.Worksheets.Add("Data");

                // Add headers from DataTable
                for (int i = 0; i < dataTable.Columns.Count; i++)
                {
                    worksheet.Cell(1, i + 1).Value = dataTable.Columns[i].ColumnName;
                }

                // Add data rows
                for (int rowIndex = 0; rowIndex < dataTable.Rows.Count; rowIndex++)
                {
                    for (int colIndex = 0; colIndex < dataTable.Columns.Count; colIndex++)
                    {
                        worksheet.Cell(rowIndex + 2, colIndex + 1).Value = (XLCellValue)dataTable.Rows[rowIndex][colIndex];
                    }
                }

                // Prepare the response to download the file
                Response.Clear();
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment; filename=SurveyResponse_ImportTemplate.xlsx");

                using (var memoryStream = new MemoryStream())
                {
                    workbook.SaveAs(memoryStream);
                    memoryStream.WriteTo(Response.OutputStream);
                }

                Response.Flush();
                Response.End();
            }

        }
        private void ImportResponse(long surveyId, int createdBy)
        {
            if (Request.Files.Count > 0)
            {
                // Get the first uploaded file
                HttpPostedFile uploadedFile = Request.Files["fileInput"];

                // Check if the file is not null and has content
                if (uploadedFile != null && uploadedFile.ContentLength > 0)
                {
                    if (uploadedFile.FileName.EndsWith(".xlsx"))
                    {
                        using (var stream = uploadedFile.InputStream)
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1); // First worksheet
                            var dataTable = new DataTable();
                            dataTable.TableName = "ImportResponse";
                            bool firstRow = true;

                            foreach (var row in worksheet.RowsUsed())
                            {
                                if (firstRow)
                                {
                                    foreach (var cell in row.Cells())
                                    {
                                        dataTable.Columns.Add(cell.Value.ToString());
                                    }
                                    firstRow = false;
                                }
                                else
                                {
                                    DataRow dataRow = dataTable.NewRow();
                                    for (int i = 0; i < dataTable.Columns.Count; i++)
                                    {
                                        dataRow[i] = row.Cell(i + 1).Value.ToString();
                                    }
                                    dataTable.Rows.Add(dataRow);
                                }
                            }

                            // Create a new DataTable with the desired format
                            DataTable resultTable = new DataTable();
                            resultTable.TableName = "ImportResponse";
                            resultTable.Columns.Add("Assignee", typeof(string));
                            resultTable.Columns.Add("Question", typeof(string));
                            resultTable.Columns.Add("Answer", typeof(string));

                            // Loop through the original table and create the new table
                            foreach (DataRow row in dataTable.Rows)
                            {
                                // For each question (Q1, Q2), create a new row in the result table
                                for (int i = 1; i < dataTable.Columns.Count; i++)  // Start at 1 to skip Assignee column
                                {
                                    DataRow newRow = resultTable.NewRow();
                                    newRow["Assignee"] = row["Assignee"];
                                    newRow["Question"] = dataTable.Columns[i].ColumnName;
                                    newRow["Answer"] = row[i].ToString();
                                    resultTable.Rows.Add(newRow);
                                }
                            }

                            DataSet dataSet = new DataSet();
                            dataSet.DataSetName = "ImportResponses";
                            dataSet.Tables.Add(resultTable);

                            string xmlString = dataSet.GetXml();

                            var connectionString = ConfigurationManager.ConnectionStrings["MASConnectionString"].ToString();
                            var query = "SP_SurveyResponse_Import";
                            var parameters = new SqlParameter[]
                                {
                                    new SqlParameter("@SurveyId", surveyId){SqlDbType = SqlDbType.BigInt},
                                    new SqlParameter("@CreatedBy", createdBy){SqlDbType = SqlDbType.Int},
                                    new SqlParameter("@XmlString", xmlString){SqlDbType = SqlDbType.NVarChar},
                                };

                            var dt = SqlHelper.GetDataTableFromSP(connectionString, query, parameters);
                            if (dt != null && dt.Rows.Count > 0)
                            {
                                string txtData = DataTableToText(dt, "\t");
                                string errorFilePath = Server.MapPath("~/Temp/ErrorFile_" + Guid.NewGuid() + ".txt");

                                File.WriteAllText(errorFilePath, txtData);

                                string downloadUrl = "Temp/" + Path.GetFileName(errorFilePath);

                                Response.ContentType = "application/json";
                                Response.Write("{\"status\":\"error\", \"message\":\"Import error. Download the file.\", \"fileUrl\":\"" + downloadUrl + "\"}");
                            }
                            else
                            {
                                Response.Write("{\"status\":\"success\", \"message\":\"Data has benn imported successfully.\"}");
                            }                            
                        }
                    }
                    else
                    {
                        // Handle case when no file is selected
                        Response.StatusCode = 400;
                        Response.ContentType = "application/json";
                        Response.Write("{\"status\":\"error\", \"message\":\"Please upload valid excel file format(.xlsx).\"}");
                    }
                }
                else
                {
                    // Handle case when no file is selected
                    Response.StatusCode = 400;
                    Response.ContentType = "application/json";
                    Response.Write("{\"status\":\"error\", \"message\":\"No file uploaded.\"}");
                }
            }
            else
            {
                // No files in the request
                Response.StatusCode = 400;
                Response.ContentType = "application/json";
                Response.Write("{\"status\":\"error\", \"message\":\"No file in the request.\"}");
            }
        }
        private string DataTableToText(DataTable dt, string delimiter)
        {
            StringBuilder sb = new StringBuilder();

            // Header row
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                sb.Append(dt.Columns[i].ColumnName);
                if (i < dt.Columns.Count - 1)
                    sb.Append(delimiter);
            }
            sb.AppendLine();

            // Data rows
            foreach (DataRow row in dt.Rows)
            {
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    sb.Append(row[i]?.ToString());
                    if (i < dt.Columns.Count - 1)
                        sb.Append(delimiter);
                }
                sb.AppendLine();
            }

            return sb.ToString();
        }
    }
}