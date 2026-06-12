using MAS.BusinessLogicLayer.Contract;
using MAS.BusinessLogicLayer;
using MAS.InversionOfControl;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Unity;
using MAS.Utility;
using MAS.Authentications;
using MAS.DataAccessLayer.UnitOfWork;

namespace MAS.Web
{
    public static class bootstrapper
    {
        public static void Init()
        {
            var jsonSerializer = new JSONSerializer2();
            var ilogger = new FileLogger();

            var uc = new UnityContainer();
            uc.RegisterType<IUnitOfWork, UnitOfWork>()
                .RegisterType<IUserInfo, UserInfo>()
                .RegisterType<ICategoryBLL, CategoryBLL>()
                .RegisterType<IQuestionTypeBLL, QuestionTypeBLL>()
                .RegisterType<IQuestionBLL, QuestionBLL>()
                .RegisterType<IQuestionOptionBLL, QuestionOptionBLL>()
                .RegisterType<IKnowledgeBLL, KnowledgeBLL>()
                .RegisterType<IKnowledgeTypeBLL, KnowledgeTypeBLL>()
                .RegisterType<ISurveyBLL, SurveyBLL>()
                .RegisterType<ISurveyAssignmentBLL, SurveyAssignmentBLL>()
                .RegisterType<IConfiguration, Configuration>()
                .RegisterType<IMeetingOccuranceBLL, MeetingOccuranceBLL>()
                .RegisterType<IMeetingBLL, MeetingBLL>()
                .RegisterType<IUserBLL, UserBLL>()
                .RegisterType<IConditionBLL, ConditionBLL>()
                .RegisterInstance(typeof(ILogger), ilogger)
                .RegisterInstance(typeof(IJSONSerializer), jsonSerializer);
            IOC.Container = uc;

            Bootstrapper.InitDataTransferObjectMapping();
        }
    }
}