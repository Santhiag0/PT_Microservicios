# Etapa 1: Construcción
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar archivos del proyecto
COPY . .

# Restaurar dependencias y publicar
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Imagen final liviana con solo runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "ProductService.dll"]
