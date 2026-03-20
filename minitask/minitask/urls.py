from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from tasks.views import RegisterView, LoginView, RefreshTokenView, UserProfileView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(url='/api/schema/swagger-ui/', permanent=False)),
    path('api/', include('tasks.urls')),
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('auth/me/', UserProfileView.as_view(), name='user_profile'),
    # Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
