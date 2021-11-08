using System.Web;
using System.Web.Mvc;

namespace Mash.SEOAnalyzer.Web.NET
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
