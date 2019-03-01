using Infolio.Core.Applications.Containers.Features;
using Infolio.Core.DynamicConfiguration;
using Ninject;
using System.Collections.Generic;

namespace Infolio.SkeletonApp.AppSettings
{
    [FeatureInfo("KioskSettings", nameof(KioskSettings))]
    public class KioskSettings : Feature<KioskSettingsConfiguration>
    {
        public KioskSettings(IKernel kernel) 
            : base(kernel)
        {
        }

        protected override IEnumerable<FormBuilderNode> GetConfigurationSchemaInternal(FormBuilderChain<KioskSettingsConfiguration> builder)
        {
            return builder
                .Add(x => x.PathToUpload, x => x
                    .StringInput()
                    .WithValidationProperties(v => v
                        .Required()))
                .Add(x => x.XMLFileName, x => x
                    .StringInput()
                    .WithValidationProperties(v => v
                        .Required()))
                .Add(x => x.ExtensionOfImages, xx => xx
                      .StringInput()
                    .WithValidationProperties(v => v
                        .Required()))
                .Build();
        }
    }
}