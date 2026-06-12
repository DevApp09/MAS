using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface ISurveyAssignmentBLL
    {
        IEnumerable<SurveyAssignmentDTO> GetAll();
        Task<IEnumerable<SurveyAssignmentDTO>> GetAllAsync();

        long InsertOrUpdate(SurveyAssignmentDTO entity);
        Task<long> InsertOrUpdateAsync(SurveyAssignmentDTO entity);

        void Delete(long surveyAssignmentId);
        Task DeleteAsync(long surveyAssignmentId);

        SurveyAssignmentDTO GetById(long surveyAssignmentId);
        Task<SurveyAssignmentDTO> GetByIdAsync(long surveyAssignmentId);

        IEnumerable<SurveyAssignmentDTO> GetAllSubmit(long surveyId);
        Task<IEnumerable<SurveyAssignmentDTO>> GetAllSubmitAsync(long surveyId);

        SurveySubmitDTO GetSubmitById(long surveyAssigneeId);
        Task<SurveySubmitDTO> GetSubmitByIdAsync(long surveyAssigneeId);

        void SubmitDelete(long id);
        Task SubmitDeleteAsync(long id);

        SurveyDeploymentInitDataDTO GetSurveyDeploymentInitDataDTO(long surveyId);
        Task<SurveyDeploymentInitDataDTO> GetSurveyDeploymentInitDataDTOAsync(long surveyId);

        Task<IEnumerable<SurveyAssignmentDTO>> GetDeployAssigneesAsync(long surveyId);
        Task<long> SaveSingleAssigneeAsync(long surveyId, int userId, int roleId);
        Task DeleteSingleAssigneeAsync(long surveyAssigneeId);
    }
}
