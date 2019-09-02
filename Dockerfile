FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS base
WORKDIR /app
#ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS http://*:5050
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS builder
ARG Configuration=Release
WORKDIR /src
COPY *.sln ./
COPY API/API.csproj API/
COPY Application/Application.csproj Application/
COPY Domain/Domain.csproj Domain/
COPY Persistence/Persistence.csproj Persistence/
RUN dotnet restore
COPY . .
WORKDIR /src/API
RUN dotnet build -c $Configuration -o /app

FROM builder AS publish
ARG Configuration=Release
RUN dotnet publish -c $Configuration -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "API.dll"]