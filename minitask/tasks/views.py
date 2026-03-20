from rest_framework import viewsets, status, filters, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Task
from .serializers import TaskSerializer, UserSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar tareas", description="Obtiene todas las tareas asociadas al usuario actual."),
    create=extend_schema(summary="Crear tarea", description="Crea una nueva tarea para el usuario logueado."),
    retrieve=extend_schema(summary="Ver detalle de tarea", description="Obtiene los datos completos de una tarea específica por ID."),
    update=extend_schema(summary="Actualizar tarea", description="Modifica todos los campos de una tarea (título, descripción, etc.)."),
    partial_update=extend_schema(summary="Actualización parcial", description="Modifica campos específicos de una tarea sin sobreescribirla por completo."),
    destroy=extend_schema(summary="Eliminar tarea", description="Borra permanentemente una tarea por ID."),
)
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_completed']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(summary="Cambiar estado (completar/pendiente)", description="Invierte el valor de `is_completed` de la tarea indicada.")
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.is_completed = not task.is_completed
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

@extend_schema(summary="Registrar nuevo usuario", description="Crea una cuenta nueva para un usuario con `username`, `email` y `password`.")
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

@extend_schema(summary="Iniciar sesión (obtener tokens)", description="Envía las credenciales del usuario para obtener un `access` y un `refresh` token.")
class LoginView(TokenObtainPairView):
    pass

@extend_schema(summary="Refrescar token de acceso", description="Permite obtener un nuevo `access` token usando el `refresh` token obtenido al loguearse.")
class RefreshTokenView(TokenRefreshView):
    pass
