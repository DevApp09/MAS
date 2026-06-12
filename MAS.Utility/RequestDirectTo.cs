using System;

namespace MAS.Utility
{
    [System.AttributeUsage(System.AttributeTargets.Method)]
    public class RequestDirectTo : System.Attribute
    {
        private string _keyword;

        public string Keyword { get { return _keyword; } }

        public RequestDirectTo(string keyword)
        {
            if (GeneralMethods.IsDbNullOrNullOrEmptyOrWhitespaceValue(keyword))
            {
                throw new ArgumentException("keyword can not be null/empty string.");
            }
            _keyword = keyword;
        }
    }
}
