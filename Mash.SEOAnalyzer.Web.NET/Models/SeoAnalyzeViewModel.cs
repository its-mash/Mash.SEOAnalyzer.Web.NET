using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Mash.SEOAnalyzer.Web.NET.CustomAttributes;

namespace Mash.SEOAnalyzer.Web.NET.Models
{
    public enum SeoAnalyzeMode
    {
        Text,
        Url
    }
    public class SeoAnalyzeViewModel
    {
        [Required]
        public SeoAnalyzeMode SeoAnalyzeMode { get; set; }

        [RequiredIf(nameof(SeoAnalyzeMode), SeoAnalyzeMode.Text, ErrorMessage = "Text can't be null or empty")]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Text { get; set; }

        [RequiredIf(nameof(SeoAnalyzeMode), SeoAnalyzeMode.Url, ErrorMessage = "The Url is required")]
        [Url]
        public string Url { get; set; }

        public bool CalculateWordOccurrenceInPageText { get; set; }
        public bool CalculateMetaDataOccurrenceInPageText { get; set; }

        public bool CalculateExternalLink { get; set; }
        public bool AnalyzeContentAfterRenderingReturnedHtmlAlso { get; set; }

        public bool FilterStopWords { get; set; }
        public Dictionary<string, string> Headers { get; set; }
    }
}