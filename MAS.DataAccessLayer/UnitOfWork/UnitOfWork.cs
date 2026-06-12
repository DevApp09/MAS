using System;
using MAS.EntityFramework;
using System.Threading.Tasks;
using MAS.EntityFramework.General;
using System.Reflection;
using MAS.Authentications;
using System.Diagnostics;
using MAS.InversionOfControl;

namespace MAS.DataAccessLayer.UnitOfWork
{
    public class UnitOfWork : IDisposable, IUnitOfWork
    {
        private bool disposed = false;
        private GeneralDbContext _context = null;

        private CategoryRepository _categoryRepository;
        private QuestionTypeRepository _questionTypeRepository;
        private QuestionRepository _questionRepository;
        private QuestionOptionRepository _questionOptionRepository;
        private KnowledgeRepository _knowledgeRepository;
        private KnowledgeTypeRepository _knowledgeTypeRepository;
        private SurveyRepository _surveyRepository;
        private SurveyAssignmentRepository _surveyAssignmentRepository;
        private MeetingOccuranceRepository _meetingOccuranceRepository;
        private MeetingRepository _meetingRepository;
        private MeetingFollowupRepository _meetingFollowupRepository;
        private UserRepository _userRepository;
        private SurveyAssigneeRepository _surveyAssigneeRepository;
        private MeetingAgendaRepository _meetingAgendaRepository;
        private MeetingAttendeeRepository _meetingAttendeeRepository;
		private ConditionRepository _conditionRepository;
        private QuestionConditionRepository _questionConditionRepository;
        private SurveyQuestionRepository _surveyQuestionRepository;
        private SurveySectionRepository _surveySectionRepository;
        private SurveySubmissionRepository _surveySubmissionRepository;

        public UnitOfWork(IUserInfo userInfo)
        {
            //_context = (GeneralDbContext)Activator.CreateInstance(Assembly.Load("S4BEntityFramework").GetType("S4BEntityFramework.Policies.HandsPolicies")); //userInfo.Companies
            _context = new GeneralDbContext();
        }
        public UnitOfWork() : this(IOC.Resolve<IUserInfo>())
        {
            #if DEBUG
            _context.Database.Log = new Action<string>((s) => { Debug.Write(s); });
            #endif
        }

        public CategoryRepository CategoryRepository
        {
            get
            {
                if (null == _categoryRepository)
                {
                    _categoryRepository = new CategoryRepository(_context);
                }
                return _categoryRepository;
            }
        }

        public QuestionTypeRepository QuestionTypeRepository
        {
            get
            {
                if (null == _questionTypeRepository)
                {
                    _questionTypeRepository = new QuestionTypeRepository(_context);
                }
                return _questionTypeRepository;
            }
        }

        public QuestionRepository QuestionRepository
        {
            get
            {
                if (null == _questionRepository)
                {
                    _questionRepository = new QuestionRepository(_context);
                }
                return _questionRepository;
            }
        }

        public QuestionOptionRepository QuestionOptionRepository
        {
            get
            {
                if (null == _questionOptionRepository)
                {
                    _questionOptionRepository = new QuestionOptionRepository(_context);
                }
                return _questionOptionRepository;
            }
        }

        public KnowledgeRepository KnowledgeRepository
        {
            get
            {
                if (null == _knowledgeRepository)
                {
                    _knowledgeRepository = new KnowledgeRepository(_context);
                }
                return _knowledgeRepository;
            }
        }

        public KnowledgeTypeRepository KnowledgeTypeRepository
        {
            get
            {
                if (null == _knowledgeTypeRepository)
                {
                    _knowledgeTypeRepository = new KnowledgeTypeRepository(_context);
                }
                return _knowledgeTypeRepository;
            }
        }

        public SurveyRepository SurveyRepository
        {
            get
            {
                if (null == _surveyRepository)
                {
                    _surveyRepository = new SurveyRepository(_context);
                }
                return _surveyRepository;
            }
        }

        public SurveyAssignmentRepository SurveyAssignmentRepository
        {
            get
            {
                if (null == _surveyAssignmentRepository)
                {
                    _surveyAssignmentRepository = new SurveyAssignmentRepository(_context);
                }
                return _surveyAssignmentRepository;
            }
        }

        public MeetingOccuranceRepository MeetingOccuranceRepository
        {
            get
            {
                if (null == _meetingOccuranceRepository)
                {
                    _meetingOccuranceRepository = new MeetingOccuranceRepository(_context);
                }
                return _meetingOccuranceRepository;
            }
        }

        public MeetingRepository MeetingRepository
        {
            get
            {
                if (null == _meetingRepository)
                {
                    _meetingRepository = new MeetingRepository(_context);
                }
                return _meetingRepository;
            }
        }

        public MeetingFollowupRepository MeetingFollowupRepository
        {
            get
            {
                if (null == _meetingFollowupRepository)
                {
                    _meetingFollowupRepository = new MeetingFollowupRepository(_context);
                }
                return _meetingFollowupRepository;
            }
        }

        public UserRepository UserRepository
        {
            get
            {
                if (null == _userRepository)
                {
                    _userRepository = new UserRepository(_context);
                }
                return _userRepository;
            }
        }

        public SurveyAssigneeRepository SurveyAssigneeRepository
        {
            get
            {
                if (null == _surveyAssigneeRepository)
                {
                    _surveyAssigneeRepository = new SurveyAssigneeRepository(_context);
                }
                return _surveyAssigneeRepository;
            }
        }

        public MeetingAgendaRepository MeetingAgendaRepository
        {
            get
            {
                if (null == _meetingAgendaRepository)
                {
                    _meetingAgendaRepository = new MeetingAgendaRepository(_context);
                }
                return _meetingAgendaRepository;
            }
        }

        public MeetingAttendeeRepository MeetingAttendeeRepository
        {
            get
            {
                if (null == _meetingAttendeeRepository)
                {
                    _meetingAttendeeRepository = new MeetingAttendeeRepository(_context);
                }
                return _meetingAttendeeRepository;
            }
        }
		
		public ConditionRepository ConditionRepository
        {
            get
            {
                if (null == _conditionRepository)
                {
                    _conditionRepository = new ConditionRepository(_context);
                }
                return _conditionRepository;
            }
        }

        public QuestionConditionRepository QuestionConditionRepository
        {
            get
            {
                if (null == _questionConditionRepository)
                {
                    _questionConditionRepository = new QuestionConditionRepository(_context);
                }
                return _questionConditionRepository;
            }
        }

        public SurveyQuestionRepository SurveyQuestionRepository
        {
            get
            {
                if (null == _surveyQuestionRepository)
                {
                    _surveyQuestionRepository = new SurveyQuestionRepository(_context);
                }
                return _surveyQuestionRepository;
            }
        }

        public SurveySectionRepository SurveySectionRepository
        {
            get
            {
                if (null == _surveySectionRepository)
                {
                    _surveySectionRepository = new SurveySectionRepository(_context);
                }
                return _surveySectionRepository;
            }
        }

        public SurveySubmissionRepository SurveySubmissionRepository
        {
            get
            {
                if (null == _surveySubmissionRepository)
                {
                    _surveySubmissionRepository = new SurveySubmissionRepository(_context);
                }
                return _surveySubmissionRepository;
            }
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public async Task SaveAsAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }
    }
}
