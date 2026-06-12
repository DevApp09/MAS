using System;
using System.Threading.Tasks;
using MAS.EntityFramework;

namespace MAS.DataAccessLayer.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        CategoryRepository CategoryRepository { get; }
        QuestionTypeRepository QuestionTypeRepository { get; }
        QuestionRepository QuestionRepository { get; }
        QuestionOptionRepository QuestionOptionRepository { get; }
        KnowledgeRepository KnowledgeRepository { get; }
        KnowledgeTypeRepository KnowledgeTypeRepository { get; }
        SurveyRepository SurveyRepository { get; }
        SurveyAssignmentRepository SurveyAssignmentRepository { get; }
        MeetingOccuranceRepository MeetingOccuranceRepository { get; }
        MeetingRepository MeetingRepository { get; }
        MeetingFollowupRepository MeetingFollowupRepository { get; }
        UserRepository UserRepository { get; }
        SurveyAssigneeRepository SurveyAssigneeRepository { get; }
        MeetingAgendaRepository MeetingAgendaRepository { get; }
        MeetingAttendeeRepository MeetingAttendeeRepository { get; }
		ConditionRepository ConditionRepository { get; }
        QuestionConditionRepository QuestionConditionRepository { get; }
        SurveyQuestionRepository SurveyQuestionRepository { get; }
        SurveySectionRepository SurveySectionRepository { get; }
        SurveySubmissionRepository SurveySubmissionRepository { get; }

        void Save();
        Task SaveAsAsync();
    }
}
