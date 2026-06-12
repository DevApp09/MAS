using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.Exceptions;

namespace MAS.BusinessLogicLayer
{
    public abstract class CrossThreadAccessCheck
    {
        private int? _threadID;
        private readonly object _lock;

        public CrossThreadAccessCheck()
        {
            _lock = new object();
        }

        protected virtual void CheckThreadSafetyAndAcquireIfNeeded()
        {
            lock (_lock)
            {
                if (null != _threadID && System.Threading.Thread.CurrentThread.ManagedThreadId != _threadID)
                {
                    ExceptionBinder.ThrowCrossThreadAccessException();
                }

                _threadID = System.Threading.Thread.CurrentThread.ManagedThreadId;
            }
        }

        protected virtual void ReleaseLock()
        {
            lock (_lock)
            {
                _threadID = null;
            }
        }

    }
}
