using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mash.SEOAnalyzer.NET;
using Mash.SEOAnalyzer.Web.NET.Models;

namespace Mash.SEOAnalyzer.Web.NET.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public ActionResult Index(SeoAnalyzeViewModel seoAnalyzeViewModel)
        {
            if (!ModelState.IsValid)
            {
                return View();

            }

            try
            {


                if (seoAnalyzeViewModel.SeoAnalyzeMode == SeoAnalyzeMode.Url)
                {
                    ILinkSeoAnalyzer linkSeoAnalyzer = new SeoLinkAnalyzer(new Uri(seoAnalyzeViewModel.Url))
                        .SetAnalyzeContentAfterRenderingReturnedHtmlAlso(seoAnalyzeViewModel
                            .AnalyzeContentAfterRenderingReturnedHtmlAlso)
                        .SetCalculateMetaDataKeywordOccurrencesInPageText(seoAnalyzeViewModel
                            .CalculateMetaDataOccurrenceInPageText)
                        .SetCalculateWordOccurrencesInPageText(seoAnalyzeViewModel.CalculateWordOccurrenceInPageText)
                        .SetCountExternalLinks(seoAnalyzeViewModel.CalculateExternalLink)
                        .SetFilterStopWords(seoAnalyzeViewModel.FilterStopWords)
                        .SetRequestHeaders(seoAnalyzeViewModel.Headers);

                    return this.Json(Newtonsoft.Json.JsonConvert.SerializeObject(linkSeoAnalyzer.GetResult()));



                }
                else
                {
                    ITextSeoAnalyzer textAnalyzer = new SeoTextAnalyzer(seoAnalyzeViewModel.Text)
                        .SetCountExternalLinks(seoAnalyzeViewModel.CalculateExternalLink)
                        .SetCalculateWordOccurrences(seoAnalyzeViewModel.CalculateWordOccurrenceInPageText)
                        .SetFilterStopWords(seoAnalyzeViewModel.FilterStopWords);

                    return this.Json(Newtonsoft.Json.JsonConvert.SerializeObject(textAnalyzer.GetResult()));

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }


        }
    }
}