namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null)
        {
            Message = message;
            StatusCode = statusCode;
            Details = details;
        }
        public int StatusCode { get; set; }

        public string Message { get; set; }

        public string Details { get; set; }
    }
}