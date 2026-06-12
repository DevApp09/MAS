using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class KnowledgeRepository : GenericRepository<Knowledge>
    {
        public KnowledgeRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<KnowledgeDTO> GetAll(int knowledgeTypeID)
        {
            var data = (from k in _context.Knowledges.AsQueryable()
                        join qt in _context.KnowledgeTypes.AsQueryable() on k.KnowledgeTypeID equals qt.KnowledgeTypeID
                        where (-1 == knowledgeTypeID || k.KnowledgeTypeID == knowledgeTypeID)
                        select new KnowledgeDTO()
                        {
                            KnowledgeID = k.KnowledgeID,
                            KnowledgeTypeID = k.KnowledgeTypeID,
                            KnowledgeType = qt.Name,
                            Date = k.Date,
                            Title = k.Title,
                            Description = k.Description,
                            FileName = k.FileName,
                            InternalFileName = k.InternalFileName,
                        }).ToList();
            return data;
        }

        //public KnowledgeDTO GetByID(long knowledgeID)
        //{
        //    var data = (from k in _context.Knowledges.AsQueryable()
        //                join qt in _context.QuestionTypes.AsQueryable() on k.QuestionTypeID equals qt.QuestionTypeID
        //                where k.KnowledgeID == knowledgeID
        //                select new KnowledgeDTO
        //                {
        //                    KnowledgeID = k.KnowledgeID,
        //                    QuestionTypeID = k.QuestionTypeID,
        //                    QuestionType = qt.Name,
        //                    Date = k.Date,
        //                    Title = k.Title,
        //                    Description = k.Description,
        //                    FileName = k.FileName,
        //                    InternalFileName = k.InternalFileName
        //                }).FirstOrDefault();
        //    return data;
        //}
    }
}
