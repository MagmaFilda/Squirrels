# ── Stage 1: Build ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore dependencies (cached layer)
COPY *.csproj .
RUN dotnet restore

# Copy all source files and publish
COPY . .
RUN dotnet publish "SquirrelsBackend.csproj" -c Release -o /app

# ── Stage 2: Runtime ───────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 10000
CMD ["dotnet", "SquirrelsBackend.dll"]