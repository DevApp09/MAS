//using AutoMapper;
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
using MAS.DataTransferObject.Enum;
using QuestionTypeEnum = MAS.DataTransferObject.Enum.QuestionType;

namespace MAS.BusinessLogicLayer
{
    public class QuestionBLL : CrossThreadAccessCheck, IQuestionBLL
    {
        private IUnitOfWork _unitOfWork;

        public QuestionBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }
        private QuestionBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<QuestionDTO> GetAll(int categoryID, int questionTypeID)
        {
            var entities = _unitOfWork.QuestionRepository.GetAll(categoryID, questionTypeID);
            return entities;
        }
        public async Task<IEnumerable<QuestionDTO>> GetAllAsync(int categoryID, int questionTypeID)
        {
            return await Task.Run(() => { return GetAll(categoryID, questionTypeID); });
        }

        public IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, long? defaultKey, string defaultValue)
        {
            var inEntities = _unitOfWork.QuestionRepository.GetAll2(isActive)
                .Select(g => new KeyValuePair<long, string>(g.QuestionID, g.Name))
                .ToList();

            if (null != defaultKey)
            {
                inEntities.Add(new KeyValuePair<long, string>(defaultKey.Value, defaultValue));
            }

            return inEntities;
        }
        public async Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, long? defaultKey, string defaultValue)
        {
            return await Task.Run(() => { return GetAllKeyValuePair(isActive, defaultKey, defaultValue); });
        }

        public long InsertOrUpdate(QuestionDTO entity)
        {
            var isExists = _unitOfWork.QuestionRepository.IsExists(entity.QuestionID, entity.Name, entity.CategoryID, entity.QuestionTypeID);

            if (isExists)
                ExceptionBinder.ThrowUniqueConstraintException("question", "name and question type");

            using (TransactionScope transactionScope = new TransactionScope())
            {
                var question = _unitOfWork.QuestionRepository.GetByID(entity.QuestionID);
                if (question == null)
                {
                    question = new Question();
                    question.CategoryID = entity.CategoryID;
                    question.QuestionTypeID = entity.QuestionTypeID;
                    question.Name = entity.Name;
                    question.IsRequired = entity.IsRequired;
                    question.Hint = entity.Hint;
                    question.Length = entity.Length;
                    question.IsActive = entity.IsActive;
                    question.IsNotApplicableOption = entity.IsNotApplicableOption;
                    question.IsDontKnowOption = entity.IsDontKnowOption;
                    question.IsAdvanced = entity.IsAdvanced;
                    question.Comments = entity.Comments;

                    _unitOfWork.QuestionRepository.Insert(question);
                    _unitOfWork.Save();
                    //return newEntity.QuestionID;
                }
                else
                {
                    isExists = _unitOfWork.QuestionRepository.IsUsedInSurvey(entity.QuestionID);

                    if (isExists)
                        ExceptionBinder.ThrowForeignConstraintException("question");

                    question.CategoryID = entity.CategoryID;
                    question.QuestionTypeID = entity.QuestionTypeID;
                    question.Name = entity.Name;
                    question.IsRequired = entity.IsRequired;
                    question.Hint = entity.Hint;
                    question.Length = entity.Length;
                    question.IsActive = entity.IsActive;
                    question.IsNotApplicableOption = entity.IsNotApplicableOption;
                    question.IsDontKnowOption = entity.IsDontKnowOption;
                    question.IsAdvanced = entity.IsAdvanced;
                    question.Comments = entity.Comments;
                }

                switch (entity.QuestionTypeID)
                {
                    case (int)QuestionTypeEnum.Number:
                    case (int)QuestionTypeEnum.Dropdown:
                    case (int)QuestionTypeEnum.RadioButton:
                    case (int)QuestionTypeEnum.Checkbox:
                    case (int)QuestionTypeEnum.MultiCheckbox:
                    case (int)QuestionTypeEnum.Date:
                    case (int)QuestionTypeEnum.Textbox:
                    case (int)QuestionTypeEnum.MultiTextbox:
                    case (int)QuestionTypeEnum.Image:
                    case (int)QuestionTypeEnum.Images:
                    case (int)QuestionTypeEnum.Location:
                    case (int)QuestionTypeEnum.Matrix:
                        break;
                    default:
                        break;
                }

                // Options
                if (entity.QuestionOptions.Count() > 0)
                {
                    //Delete Options
                    foreach (var option in entity.QuestionOptions.Where(x => x.IsDelete == true))
                    {
                        _unitOfWork.QuestionOptionRepository.Delete(option.QuestionOptionID);
                        _unitOfWork.Save();
                    }

                    //Insert/Update Options
                    foreach (var option in entity.QuestionOptions.Where(x => x.IsDelete == false))
                    {
                        //var questionOption2 = _unitOfWork.QuestionOptionRepository.GetFirst(x=> x.QuestionOptionID == option.QuestionOptionID);
                        var questionOption = _unitOfWork.QuestionOptionRepository.GetByID(option.QuestionOptionID);
                        if (questionOption == null)
                        {
                            questionOption = new QuestionOption();
                            questionOption.QuestionID = question.QuestionID;
                            questionOption.Option = option.Option;
                            questionOption.IsActive = option.IsActive;
                            _unitOfWork.QuestionOptionRepository.Insert(questionOption);
                        }
                        else
                        {
                            questionOption.Option = option.Option;
                            questionOption.IsActive = option.IsActive;
                        }
                    }
                }

                //Conditions
                if (entity.QuestionConditions.Count() > 0)
                {
                    //Delete Conditoins
                    foreach (var condition in entity.QuestionConditions.Where(x => x.IsDelete == true))
                    {
                        _unitOfWork.QuestionConditionRepository.Delete(condition.QuestionConditionID);
                        _unitOfWork.Save();
                    }

                    //Insert/Update Options
                    foreach (var condition in entity.QuestionConditions.Where(x => x.IsDelete == false))
                    {
                        //var questionOption2 = _unitOfWork.QuestionOptionRepository.GetFirst(x=> x.QuestionOptionID == option.QuestionOptionID);
                        var questionCondition = _unitOfWork.QuestionConditionRepository.GetByID(condition.QuestionConditionID);
                        if (questionCondition == null)
                        {
                            questionCondition = new QuestionCondition();
                            questionCondition.QuestionID = question.QuestionID;
                            questionCondition.ConditionQuestionID = condition.ConditionQuestionID;
                            questionCondition.ConditionID = condition.ConditionID;
                            questionCondition.ConditionKey = condition.ConditionKey;
                            questionCondition.ConditionValue = condition.ConditionValue;
                            _unitOfWork.QuestionConditionRepository.Insert(questionCondition);
                        }
                        //else
                        //{
                        //    questionCondition.QuestionID = condition.QuestionID;
                        //    questionCondition.ConditionID = condition.ConditionID;
                        //    questionCondition.ConditionKey = condition.ConditionKey;
                        //    questionCondition.ConditionValue = condition.ConditionValue;
                        //}
                    }
                }

                _unitOfWork.Save();
                transactionScope.Complete();
                return question.QuestionID;
            }
            return -1;
        }
        public async Task<long> InsertOrUpdateAsync(QuestionDTO entity)
        {
            return await Task.Run(() => { return InsertOrUpdate(entity); });
        }

        public void Delete(long questionID)
        {
            if (_unitOfWork.QuestionRepository.GetByID(questionID) != null)
            {
                try
                {
                    using (TransactionScope transactionScope = new TransactionScope())
                    {
                        foreach (var item in _unitOfWork.QuestionOptionRepository.GetAll(null, questionID))
                        {
                            _unitOfWork.QuestionOptionRepository.Delete(item.QuestionID);
                        }

                        foreach (var item in _unitOfWork.QuestionConditionRepository.GetAll(questionID))
                        {
                            _unitOfWork.QuestionConditionRepository.Delete(item.QuestionConditionID);
                        }

                        _unitOfWork.QuestionRepository.Delete(questionID);
                        _unitOfWork.Save();

                        transactionScope.Complete();
                    }                       
                }
                catch (Exception)
                {
                    ExceptionBinder.ThrowForeignConstraintException("surveyquestion");
                }
            }
            else
            {
                ExceptionBinder.GetUnavailableDataException("question", "delete");
            }
        }
        public async Task DeleteAsync(long questionID)
        {
            await Task.Run(() => { Delete(questionID); });
        }

        public QuestionDTO GetById(long questionID)
        {
            var data = _unitOfWork.QuestionRepository.GetInfoByID(questionID);
            return data;
        }
        public async Task<QuestionDTO> GetByIdAsync(long questionID)
        {
            return await Task.Run(() => { return GetById(questionID); });
        }

        public IEnumerable<QuestionDTO> GetAll(bool? isActive)
        {
            var entities = _unitOfWork.QuestionRepository.GetAll2(isActive);
            return entities;
        }
        public async Task<IEnumerable<QuestionDTO>> GetAllAsync(bool? isActive)
        {
            return await Task.Run(() => { return GetAll(isActive); });
        }
    }
}
