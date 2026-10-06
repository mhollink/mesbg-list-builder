@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0.."
set "ROOT_DIR=%CD%"

echo.
echo Project quick start
echo ===================
echo.

if not exist ".java-version" (
    echo ERROR: .java-version not found.
    exit /b 1
)

if not exist ".nvmrc" (
    echo ERROR: .nvmrc not found.
    exit /b 1
)

set /p JAVA_VERSION=<.java-version
set /p NODE_VERSION=<.nvmrc

call :ensure_java
if errorlevel 1 exit /b 1

call :ensure_fnm
if errorlevel 1 exit /b 1

call :configure_git_bash
if errorlevel 1 exit /b 1

call :ensure_node
if errorlevel 1 exit /b 1

call :ensure_pnpm
if errorlevel 1 exit /b 1

call :ensure_docker
if errorlevel 1 exit /b 1

call :ensure_make
if errorlevel 1 exit /b 1

call :install_dependencies
if errorlevel 1 exit /b 1

echo.
echo ========================================
echo Setup complete.
echo ========================================
echo.
echo You can now run:
echo   make setup
echo.

exit /b 0


:ensure_java

echo Checking Java %JAVA_VERSION%...

where java >nul 2>&1

if errorlevel 1 (
    echo Java is not installed.
    goto install_java
)

for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set "JAVA_VERSION_STRING=%%~v"
)

for /f "tokens=1 delims=." %%v in ("!JAVA_VERSION_STRING!") do (
    set "CURRENT_JAVA_VERSION=%%v"
)

if "!CURRENT_JAVA_VERSION!"=="%JAVA_VERSION%" (
    echo Java %JAVA_VERSION% is already installed.
    goto :eof
)

echo Java !CURRENT_JAVA_VERSION! found, but Java %JAVA_VERSION% is required.

:install_java

where winget >nul 2>&1

if errorlevel 1 (
    echo ERROR: winget is required to install Java automatically.
    exit /b 1
)

echo Installing JDK %JAVA_VERSION%...

winget install ^
    --id EclipseAdoptium.Temurin.%JAVA_VERSION%.JDK ^
    --exact ^
    --accept-package-agreements ^
    --accept-source-agreements

if errorlevel 1 (
    echo ERROR: Failed to install JDK %JAVA_VERSION%.
    exit /b 1
)

echo Java installation completed.
echo A new terminal may be required before Java becomes available.

goto :eof


:ensure_fnm

echo.
echo Checking fnm...

where fnm >nul 2>&1

if not errorlevel 1 (
    echo fnm is already installed.
    goto setup_fnm
)

where winget >nul 2>&1

if errorlevel 1 (
    echo ERROR: winget is required to install fnm automatically.
    exit /b 1
)

echo Installing fnm...

winget install ^
    --id Schniz.fnm ^
    --exact ^
    --accept-package-agreements ^
    --accept-source-agreements

if errorlevel 1 (
    echo ERROR: Failed to install fnm.
    exit /b 1
)

REM winget may not update PATH for this running process.
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\fnm.exe" (
    set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%"
)

where fnm >nul 2>&1

if errorlevel 1 (
    echo ERROR: fnm was installed but is not available on PATH.
    echo Open a new terminal and run this script again.
    exit /b 1
)

:setup_fnm

for /f "tokens=*" %%i in ('fnm env --shell cmd') do call %%i

goto :eof


:ensure_node

echo.
echo Checking Node.js %NODE_VERSION%...

fnm install %NODE_VERSION%

if errorlevel 1 (
    echo ERROR: Failed to install Node.js %NODE_VERSION%.
    exit /b 1
)

fnm use %NODE_VERSION%

if errorlevel 1 (
    echo ERROR: Failed to activate Node.js %NODE_VERSION%.
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set "CURRENT_NODE_VERSION=%%v"

echo Node !CURRENT_NODE_VERSION! is active.

goto :eof


:ensure_pnpm

echo.
echo Enabling pnpm...

where corepack >nul 2>&1

if errorlevel 1 (
    echo ERROR: Corepack is not available.
    exit /b 1
)

call corepack enable

if errorlevel 1 (
    echo ERROR: Failed to enable Corepack.
    exit /b 1
)

call corepack install

if errorlevel 1 (
    echo ERROR: Failed to install the configured pnpm version.
    exit /b 1
)

for /f "tokens=*" %%v in ('pnpm --version') do set "PNPM_VERSION=%%v"

echo pnpm !PNPM_VERSION! is available.

goto :eof


:configure_git_bash

echo.
echo Configuring Git Bash...

set "BASHRC=%USERPROFILE%\.bashrc"
set "BASH_PROFILE=%USERPROFILE%\.bash_profile"
set "FNM_BASH_INIT=eval "$(fnm env --use-on-cd --shell bash)""

REM Ensure .bashrc exists.
if not exist "%BASHRC%" (
    type nul > "%BASHRC%"
    echo Created %BASHRC%
)

REM Ensure fnm is initialized by Git Bash.
findstr /c:"fnm env --use-on-cd --shell bash" "%BASHRC%" >nul 2>&1

if errorlevel 1 (
    >>"%BASHRC%" echo !FNM_BASH_INIT!
    echo Configured fnm in .bashrc.
)

REM Git Bash login shells need a profile that loads .bashrc.
if not exist "%USERPROFILE%\.bash_profile" if not exist "%USERPROFILE%\.bash_login" if not exist "%USERPROFILE%\.profile" (
    >"%BASH_PROFILE%" echo if [ -f ~/.bashrc ]; then
    >>"%BASH_PROFILE%" echo   . ~/.bashrc
    >>"%BASH_PROFILE%" echo fi

    echo Created %BASH_PROFILE%
)

exit /b 0


:ensure_docker

echo.
echo Checking Docker...

where docker >nul 2>&1

if not errorlevel 1 (
    goto docker_available
)

where winget >nul 2>&1

if errorlevel 1 (
    echo ERROR: winget is required to install Docker automatically.
    exit /b 1
)

echo Installing Docker Desktop...

winget install ^
    --id Docker.DockerDesktop ^
    --exact ^
    --accept-package-agreements ^
    --accept-source-agreements

if errorlevel 1 (
    echo ERROR: Failed to install Docker Desktop.
    exit /b 1
)

REM Docker Desktop normally exposes docker.exe here.
set "DOCKER_BIN=C:\Program Files\Docker\Docker\resources\bin"

if exist "%DOCKER_BIN%\docker.exe" (
    set "PATH=%DOCKER_BIN%;%PATH%"
)

where docker >nul 2>&1

if errorlevel 1 (
    echo ERROR: Docker was installed but is not available on PATH.
    echo Open a new terminal and run this script again.
    exit /b 1
)

:docker_available

docker compose version >nul 2>&1

if errorlevel 1 (
    echo ERROR: Docker Compose v2 is required.
    exit /b 1
)

docker info >nul 2>&1

if not errorlevel 1 (
    goto docker_running
)

echo Docker Desktop is not running.
echo Starting Docker Desktop...

if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
) else (
    echo ERROR: Docker Desktop could not be located.
    exit /b 1
)

echo Waiting for Docker Desktop...

set /a DOCKER_ATTEMPTS=0

:wait_for_docker

docker info >nul 2>&1

if not errorlevel 1 goto docker_running

set /a DOCKER_ATTEMPTS+=1

if !DOCKER_ATTEMPTS! GEQ 60 (
    echo ERROR: Docker Desktop did not become ready.
    exit /b 1
)

timeout /t 2 /nobreak >nul
goto wait_for_docker

:docker_running

for /f "tokens=*" %%v in ('docker --version') do echo %%v
for /f "tokens=*" %%v in ('docker compose version') do echo %%v

goto :eof


:ensure_make

echo.
echo Checking Make...

set "MAKE_BIN=C:\Program Files (x86)\GnuWin32\bin"

REM Already available on PATH.
where make >nul 2>&1
if not errorlevel 1 (
    goto make_available
)

REM Installed, but not yet available on this process's PATH.
if exist "%MAKE_BIN%\make.exe" (
    echo Make is already installed.
    goto configure_make
)

where winget >nul 2>&1
if errorlevel 1 (
    echo ERROR: winget is required to install Make automatically.
    exit /b 1
)

echo Installing Make...

winget install ^
    --id GnuWin32.Make ^
    --exact ^
    --accept-package-agreements ^
    --accept-source-agreements

if errorlevel 1 (
    echo ERROR: Failed to install Make.
    exit /b 1
)

if not exist "%MAKE_BIN%\make.exe" (
    echo ERROR: Make was installed but make.exe could not be found.
    exit /b 1
)

:configure_make

REM Make it available to this script immediately.
set "PATH=%MAKE_BIN%;%PATH%"

REM Persist it to the user's PATH for future terminals.
powershell -NoProfile -Command ^
    "$makeBin = '%MAKE_BIN%';" ^
    "$userPath = [Environment]::GetEnvironmentVariable('Path', 'User');" ^
    "$entries = @($userPath -split ';' | Where-Object { $_ });" ^
    "if ($entries -notcontains $makeBin) {" ^
    "  [Environment]::SetEnvironmentVariable('Path', (($entries + $makeBin) -join ';'), 'User')" ^
    "}"

if errorlevel 1 (
    echo ERROR: Failed to add Make to the user PATH.
    exit /b 1
)

:make_available

for /f "tokens=*" %%v in ('make --version ^| findstr /b "GNU Make"') do (
    echo %%v is available.
)

goto :eof


:install_dependencies

echo.
echo Installing Node dependencies...

call pnpm install

if errorlevel 1 (
    echo ERROR: pnpm install failed.
    exit /b 1
)

echo.
echo Checking Maven Wrapper...

if not exist "apps\backend\mvnw.cmd" (
    echo ERROR: apps\backend\mvnw.cmd is missing.
    exit /b 1
)

pushd "%ROOT_DIR%\apps\backend"
call mvnw.cmd dependency:go-offline
if errorlevel 1 (
    popd
    echo ERROR: Maven Wrapper failed.
    exit /b 1
)
popd

goto :eof