using MAS.EntityFramework;
using MAS.Exceptions;
using MAS.InversionOfControl;
using MAS.BusinessLogicLayer.Contract;
using MAS.DataAccessLayer;
using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.DataAccessLayer.UnitOfWork;
using System.Transactions;
using System.Xml.Schema;
using System.Security.Cryptography;
using System.IO;

namespace MAS.BusinessLogicLayer
{
    public class SurveyBLL : CrossThreadAccessCheck, ISurveyBLL
    {
        private IUnitOfWork _unitOfWork;

        public SurveyBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }
        private SurveyBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<SurveyDTO> GetAll(int roleID, int userID, int categoryID)
        {
            var entities = _unitOfWork.SurveyRepository.GetAll(roleID, userID, categoryID, null);
            return entities;
        }
        public async Task<IEnumerable<SurveyDTO>> GetAllAsync(int roleID, int userID, int categoryID)
        {
            return await Task.Run(() => { return GetAll(roleID, userID, categoryID); });
        }

        public IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, int? defaultKey, string defaultValue)
        {
            throw new NotImplementedException();
            //var inEntities = _unitOfWork.SurveyRepository.GetAll(isActive)
            //    .Select(g => new KeyValuePair<long, string>(g.SurveyID, g.Name))
            //    .ToList();

            //if (null != defaultKey)
            //{
            //    inEntities.Add(new KeyValuePair<long, string>(defaultKey.Value, defaultValue));
            //}

            //return inEntities;
        }
        public async Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, int? defaultKey, string defaultValue)
        {
            return await Task.Run(() => { return GetAllKeyValuePair(isActive, defaultKey, defaultValue); });
        }

        public long InsertOrUpdate(Survey2DTO entity)
        {
            var isExists = _unitOfWork.SurveyRepository.IsExists(entity.SurveyID, entity.Name);

            if (isExists)
                ExceptionBinder.ThrowUniqueConstraintException("survey", "name");

            using (TransactionScope transactionScope = new TransactionScope())
            {
                long surveyID = 0;
                var survey = _unitOfWork.SurveyRepository.GetByID(entity.SurveyID);
                if (survey == null)
                {
                    survey = new Survey();
                    survey.CategoryID = entity.CategoryID;
                    survey.Name = entity.Name;
                    survey.Description = entity.Description;
                    survey.IsActive = entity.IsActive;
                    survey.CategoryID = entity.CategoryID;
                    _unitOfWork.SurveyRepository.Insert(survey);
                    _unitOfWork.Save();
                    surveyID = survey.SurveyID;
                    //return newEntity.QuestionID;
                }
                else
                {
                    survey.Name = entity.Name;
                    survey.Description = entity.Description;
                    survey.IsActive = entity.IsActive;
                    surveyID = survey.SurveyID;
                }

                //New and Update Section
                var sections = (from q in entity.Questions
                                where q.State != 3
                                select new { ID = q.SectionID, Name = q.SectionName })
                                .Distinct();

                foreach (var section in sections)
                {
                    if (section.ID <= 0)
                    {
                        var surveySection = new SurveySection()
                        {
                            IsActive = true,
                            Name = section.Name,
                            SurveyID = surveyID,
                            CreatedOn = DateTime.Now,
                        };
                        _unitOfWork.SurveySectionRepository.Insert(surveySection);
                        _unitOfWork.Save();

                        var questionsToUpdateSectionId = entity.Questions.Where(q => q.SectionID == section.ID);
                        foreach (var questionToUpdateSectionId in questionsToUpdateSectionId)
                        {
                            questionToUpdateSectionId.SectionID = surveySection.SurveySectionID;
                        }
                    }
                    else
                    {

                    }
                }

                //Questions
                int sequence = 1;
                foreach (var question in entity.Questions)
                {
                    if (question.QuestionID > 0)
                    {
                        var questionToUpdate = _unitOfWork.QuestionRepository.GetSingle(q => q.QuestionID == question.QuestionID);
                        questionToUpdate.CategoryID = entity.CategoryID;
                        questionToUpdate.QuestionTypeID = question.QuestionTypeID;
                        questionToUpdate.Name = question.Name;
                        questionToUpdate.IsRequired = question.IsRequired;
                        questionToUpdate.Hint = question.Hint;
                        questionToUpdate.Length = question.Length;
                        questionToUpdate.IsActive = question.IsActive;
                        questionToUpdate.IsNotApplicableOption = question.IsNotApplicableOption;
                        questionToUpdate.IsDontKnowOption = question.IsDontKnowOption;
                        questionToUpdate.IsAdvanced = question.IsAdvanced;
                        questionToUpdate.Comments = question.Comments;
                        questionToUpdate.DoRecordGPS = question.DoRecordGPS;
                        questionToUpdate.FormatID = question.FormatID == -1 ? null : question.FormatID;
                        questionToUpdate.Unit = question.Unit;
                        questionToUpdate.CascadeDropdownMarkup = question.CascadeDropDownMarkup;
                    }

                    if (question.QuestionID <= 0)
                    {
                        var questionInsert = new Question();
                        questionInsert.CategoryID = entity.CategoryID;// question.CategoryID;
                        questionInsert.QuestionTypeID = question.QuestionTypeID;
                        questionInsert.Name = question.Name;
                        questionInsert.IsRequired = question.IsRequired;
                        questionInsert.Hint = question.Hint;
                        questionInsert.Length = question.Length;
                        questionInsert.IsActive = question.IsActive;
                        questionInsert.IsNotApplicableOption = question.IsNotApplicableOption;
                        questionInsert.IsDontKnowOption = question.IsDontKnowOption;
                        questionInsert.IsAdvanced = question.IsAdvanced;
                        questionInsert.Comments = question.Comments;
                        questionInsert.DoRecordGPS = question.DoRecordGPS;
                        questionInsert.FormatID = question.FormatID;
                        questionInsert.Unit = question.Unit;
                        questionInsert.CascadeDropdownMarkup = question.CascadeDropDownMarkup;
                        _unitOfWork.QuestionRepository.Insert(questionInsert);
                        _unitOfWork.Save();

                        var questionOptions = (from qo in entity.QuestionOptions
                                               where qo.QuestionID == question.QuestionID
                                               select qo).ToArray();

                        foreach (var qo in questionOptions)
                        {
                            qo.QuestionID = questionInsert.QuestionID;
                        }

                        var surveyQuestion = new SurveyQuestion();
                        surveyQuestion.SurveyID = surveyID;
                        surveyQuestion.SurveySectionID = 1;
                        surveyQuestion.QuestionID = questionInsert.QuestionID;
                        surveyQuestion.Sequence = sequence;
                        surveyQuestion.SurveySectionID = question.SectionID;
                        _unitOfWork.SurveyQuestionRepository.Insert(surveyQuestion);
                        _unitOfWork.Save();
                    }
                    else if (question.QuestionID > 0 && question.State == 3)
                    {
                        var optionData = _unitOfWork.QuestionOptionRepository.GetMany(x => x.QuestionID == question.QuestionID);
                        if (optionData != null)
                        {
                            foreach (var item in optionData)
                            {
                                _unitOfWork.QuestionOptionRepository.Delete(item.QuestionOptionID);
                            }
                            _unitOfWork.Save();
                        }

                        var conditionData = _unitOfWork.QuestionConditionRepository.GetMany(x => x.QuestionID == question.QuestionID);
                        if (conditionData != null)
                        {
                            foreach (var item in conditionData)
                            {
                                _unitOfWork.QuestionConditionRepository.Delete(item.QuestionConditionID);
                            }
                            _unitOfWork.Save();
                        }

                        _unitOfWork.QuestionRepository.Delete(question.QuestionID);
                        _unitOfWork.Save();
                    }
                }

                //Options
                foreach (var option in entity.QuestionOptions)
                {
                    if (option.QuestionOptionID <= 0)
                    {
                        var optionInsert = new QuestionOption();
                        optionInsert.QuestionID = option.QuestionID;
                        optionInsert.Option = option.Option;
                        _unitOfWork.QuestionOptionRepository.Insert(optionInsert);
                    }
                    else if (option.QuestionOptionID > 0 && option.State == 2)
                    {
                        var optionUpdate = _unitOfWork.QuestionOptionRepository.GetByID(option.QuestionOptionID);
                        if (optionUpdate != null)
                        {
                            optionUpdate.Option = option.Option;
                        }
                    }
                    else if (option.QuestionOptionID > 0 && option.State == 3)
                    {
                        _unitOfWork.QuestionOptionRepository.Delete(option.QuestionOptionID);
                    }
                }

                //Conditions
                foreach (var condition in entity.QuestionConditions)
                {
                    if (condition.QuestionConditionID <= 0)
                    {
                        var conditionInsert = new QuestionCondition();
                        conditionInsert.QuestionID = condition.QuestionID;
                        conditionInsert.ConditionQuestionID = condition.ConditionQuestionID;
                        conditionInsert.ConditionID = condition.ConditionID;
                        _unitOfWork.QuestionConditionRepository.Insert(conditionInsert);
                    }
                    else if (condition.QuestionConditionID > 0 && condition.State == 3)
                    {
                        _unitOfWork.QuestionConditionRepository.Delete(condition.QuestionConditionID);
                    }
                }

                //New and Update Section
                var deleteSections = (from q in entity.Questions
                                      where q.State == 3 && q.IsSectionDeleted
                                      select new { ID = q.SectionID, Name = q.SectionName })
                                .Distinct();

                foreach (var deleteSection in deleteSections)
                {
                    _unitOfWork.SurveySectionRepository.Delete(deleteSection.ID);
                }


                _unitOfWork.Save();
                transactionScope.Complete();
                return survey.SurveyID;
            }
            return -1;
        }
        public async Task<long> InsertOrUpdateAsync(Survey2DTO entity)
        {
            return await Task.Run(() => { return InsertOrUpdate(entity); });
        }

        public Survey2DTO GetById(long surveyID)
        {
            var data = _unitOfWork.SurveyRepository.GetInfoById(surveyID);
            return data;
        }
        public async Task<Survey2DTO> GetByIdAsync(long surveyID)
        {
            return await Task.Run(() => { return GetById(surveyID); });
        }

        public void DeleteById(long surveyID)
        {
            bool isSurveySubmitted = _unitOfWork.SurveySubmissionRepository.GetMany(ss => ss.SurveyID == surveyID).Any();
            if (isSurveySubmitted)
            {
                throw new BLLException("Unable to delete survey becuase it is already submitted.");
            }

            using (TransactionScope transactionScope = new TransactionScope())
            {
                var survey = _unitOfWork.SurveyRepository.GetByID(surveyID);

                foreach (var surveyQuestion in survey.SurveyQuestions.ToArray())
                {
                    var question = surveyQuestion.Question;

                    foreach (var option in question.QuestionOptions.ToArray())
                    {
                        _unitOfWork.QuestionOptionRepository.Delete(option);
                    }

                    var questionConditions = _unitOfWork.QuestionConditionRepository.GetMany(qc => qc.QuestionID == question.QuestionID);
                    foreach (var questionCondition in questionConditions.ToArray())
                    {
                        _unitOfWork.QuestionConditionRepository.Delete(questionCondition);
                        //_unitOfWork.ConditionRepository.Delete(questionCondition.ConditionID);
                    }

                    _unitOfWork.SurveyQuestionRepository.Delete(surveyQuestion);

                    _unitOfWork.QuestionRepository.Delete(question);
                }

                foreach (var section in survey.SurveySections.ToArray())
                {
                    _unitOfWork.SurveySectionRepository.Delete(section);
                }


                foreach (var surveyAssignee in survey.SurveyAssignees.ToArray())
                {
                    _unitOfWork.SurveyAssigneeRepository.Delete(surveyAssignee);
                }

                _unitOfWork.SurveyRepository.Delete(survey);

                _unitOfWork.Save();
                transactionScope.Complete();
            }
        }

        public async Task DeleteByIDAsync(long surveyID)
        {
            await Task.Run(() => { DeleteById(surveyID); });
        }

        public void UpdateSurveyAnswer(SurveySubmissionDTO surveySubmissionDTO)
        {
            foreach (var answer in surveySubmissionDTO.Answers)
            {
                var surveySubmission = _unitOfWork.SurveySubmissionRepository.Get(ss => ss.SurveyAssigneeID == surveySubmissionDTO.SurveyAssigneeID && ss.QuestionID == answer.QuestionID);

                if (surveySubmission == null)
                {
                    var surveyAssignee = _unitOfWork.SurveyAssigneeRepository.GetSingle(sa => sa.SurveyAssigneeID == surveySubmissionDTO.SurveyAssigneeID);

                    surveySubmission = new SurveySubmission()
                    {
                        Answer = "",
                        AssigneeID = surveyAssignee.AssigneeID,
                        QuestionID = answer.QuestionID,
                        QuestionOption = answer.Option,
                        QuestionOptionID = answer.OptionID,
                        SurveyAssigneeID = surveySubmissionDTO.SurveyAssigneeID,
                        SurveyID = surveyAssignee.SurveyID,
                    };

                    _unitOfWork.SurveySubmissionRepository.Insert(surveySubmission);
                    _unitOfWork.Save();
                }

                if (answer.QuestionTypeID >= 2 && answer.QuestionTypeID <= 5)
                {
                    surveySubmission.QuestionOptionID = answer.OptionID;
                    surveySubmission.QuestionOption = answer.Option;

                }
                else if (answer.QuestionTypeID == 9)
                {
                    surveySubmission.Answer = Path.GetFileName(answer.Answer);
                }
                else if (answer.QuestionTypeID == 10)
                {
                    var files = answer.Answer.Split(',');
                    if (files.Length > 1)
                    {
                        surveySubmission.Answer = answer.Answer.Split(',').Aggregate((a, b) => Path.GetFileName(a) + ',' + Path.GetFileName(b));
                    }
                    else
                    {
                        surveySubmission.Answer = Path.GetFileName(answer.Answer);
                    }

                }
                else
                {
                    surveySubmission.Answer = answer.Answer;
                }
            }

            _unitOfWork.Save();
        }

        public async Task UpdateSurveyAnswerAsync(SurveySubmissionDTO surveySubmissionDTO)
        {
            await Task.Run(() => { UpdateSurveyAnswer(surveySubmissionDTO); });
        }
    }
}
