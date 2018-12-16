using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

using Moments.Controllers;
using Moments;

public class AuthFilter : ActionFilterAttribute 
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var controller = (BaseController)filterContext.Controller;
        var authString = filterContext.HttpContext.Request.Headers["auth"].ToString();

        if (!Utils.Authenticate(authString, controller.Database.ApiKey, out string msg))
        {
            var result = new ContentResult
            {
                Content = msg,
                ContentType = "application/json",
                StatusCode = 401
            };

            filterContext.Result = result;
        }
    }
}