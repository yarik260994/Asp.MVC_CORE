using Infolio.Core.Applications;
using Infolio.Core.Internal.Data;
using Infolio.SkeletonApp.AppSettings;
using Ninject;
using System;
using System.Threading.Tasks;

namespace Infolio.SkeletonApp
{
    public class SkeletonApplication : InfolioApplication
    {
        public SkeletonApplication()
        {
            UseFeature<KioskSettings>();
        }

        protected override async Task OnStart(IKernel kernel, InfolioApplicationData applicationData)
        {
            //привязываем наши сервисы и прочие классы для DI
            kernel.Bind<SkeletonAppliсationService>().ToSelf().InSingletonScope();
            //для примера используем единую точку входа
            var service = kernel.Get<SkeletonAppliсationService>();
            await service.Configure(kernel, applicationData);
        }

        protected override void OnStop(Exception exception)
        {
            base.OnStop(exception);
        }

        protected override void OnProcessExit(object sender, EventArgs e)
        {
            base.OnProcessExit(sender, e);
        }
    }
}