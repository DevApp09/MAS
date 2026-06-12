using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface ISurveyBLL
    {
        IEnumerable<SurveyDTO> GetAll(int roleID, int userID, int categoryID);
        Task<IEnumerable<SurveyDTO>> GetAllAsync(int roleID, int userID, int categoryID);

        IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, int? defaultKey, string defaultValue);
        Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, int? defaultKey, string defaultValue);

        long InsertOrUpdate(Survey2DTO entity);
        Task<long> InsertOrUpdateAsync(Survey2DTO entity);

        Survey2DTO GetById(long surveyID);
        Task<Survey2DTO> GetByIdAsync(long surveyID);

        void DeleteById(long surveyID);
        Task DeleteByIDAsync(long surveyID);

        void UpdateSurveyAnswer(SurveySubmissionDTO surveySubmissionDTO);
        Task UpdateSurveyAnswerAsync(SurveySubmissionDTO surveySubmissionDTO);
    }
}
