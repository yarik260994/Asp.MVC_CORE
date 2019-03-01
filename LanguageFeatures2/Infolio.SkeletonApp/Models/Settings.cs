using Infolio.SkeletonApp.Models.Buttons;
using Infolio.SkeletonApp.Models.Layout;
using System.Collections.Generic;

namespace Infolio.SkeletonApp.Models
{
    /// <summary>
    /// https://wireframepro.mockflow.com/view/D251411747981bbeebc75ded1dbf1460b
    /// </summary>
    public class Settings
    {
        public LayoutSettings Layout { get; set; }

        public List<Button> Buttons { get; set; }
    }
}