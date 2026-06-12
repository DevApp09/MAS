using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Exceptions
{
    public static class ExceptionBinder
    {
        public static BLLException GetRequiredParameterException(string parameterName)
        {
            return new BLLException("Please provide " + parameterName + ".");
        }

        public static BLLException GetMaximumLengthException(string parameterName)
        {
            return new BLLException(parameterName + " is too long.");
        }

        public static BLLException GetInvalidArgumentException(string argument)
        {
            return new BLLException(argument + " is invalid.");
        }

        public static DALException GetUniqueConstraintException(string entity, string attribute)
        {
            return new DALException("System was unable to add " + entity + " because " + entity + " with same " + attribute + " already exists in the system.");
        }

        public static DALException GetForeignConstraintException(string entity)
        {
            return new DALException("System was unable to delete " + entity + " because it is being used by other forms.");
        }

        public static DALException GetUnavailableDataException(string entity, string action)
        {
            var msg = "System was unable to " + action + " selected " + entity + ". It might be deleted or updated by other user."
                + Environment.NewLine + "Please refresh the page to get the latest data and then retry or contact your administrator.";
            return new DALException(msg);
        }

        public static BLLException GetValueGreaterException(string parameterName1, string parameterName2)
        {
            return new BLLException(parameterName1 + " can't be greater than " + parameterName2 + ".");
        }

        public static void ThrowCrossThreadAccessException()
        {
            throw new InvalidOperationException("Cross thread access is not allowed.");
        }

        public static BLLException ThrowRequiredParameterException(string parameterName)
        {
            throw new BLLException("Please provie " + parameterName + ".");
        }

        public static BLLException ThrowMaximumLengthException(string parameterName)
        {
            throw new BLLException(parameterName + " is too long.");
        }

        public static BLLException ThrowInvalidArgumentException(string argument)
        {
            throw new BLLException(argument + " is invalid.");
        }

        public static DALException ThrowUniqueConstraintException(string entity, string attribute)
        {
            throw new DALException("System was unable to add/edit " + entity + " because " + entity + " with same " + attribute + " already exists in the system.");
        }

        public static DALException ThrowForeignConstraintException(string entity)
        {
            throw new DALException("System was unable to add/edit/delete " + entity + " because it is being used by other forms.");
        }

        public static DALException ThrowUnavailableDataException(string entity, string action)
        {
            var msg = "System was unable to " + action + " selected " + entity + ". It might be deleted or updated by other user."
                + Environment.NewLine + "Please refresh the page to get the latest data and then retry or contact your administrator.";
            throw new DALException(msg);
        }

        public static BLLException ThrowValueGreaterException(string parameterName1, string parameterName2)
        {
            throw new BLLException(parameterName1 + " can't be greater than " + parameterName2 + ".");
        }

        public static BLLException ThrowOverLappingException(string entity, string attribute)
        {
            throw new BLLException(entity + " with " + attribute + " are overlapping with previous "+ entity.ToLower() + "(s).");
        }

        public static DALException ThrowUniqueConstraintException(string entity, string attribute, string message)
        {
            if (!string.IsNullOrEmpty(message))
                message = " " + message + ".";

            throw new DALException("System was unable to add/edit " + entity + " because " + entity + " with same " + attribute + " already exists in the system." + message);
        }

        public static DALException GetExists(string entity, string attribute)
        {
            return new DALException("System was unable to " + attribute + " " + entity + " because it is already " + attribute + ".");
        }
    }
}
