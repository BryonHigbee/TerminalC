@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: This URL now points to your single, unified Node.js server
set "server_url=http://localhost:8080"
set "gameID=lc8e8s29sw"
set "auth_url=https://pastebin.com/raw/UHBj6cc2"

color 3
cls

:menu
cls
title Simple Batch Tool
echo                           ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗         ██████╗
echo                           ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║         ██╔════╝
echo                              ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║         ██║     
echo                              ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║         ██║     
echo                              ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗    ╚██████╗
echo                              ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝     ╚═════╝v1.0.0 
echo.
echo Made by LevelDevide
echo.

set /p "user_key=Enter Key: "
if not defined user_key goto menu

echo Authenticating...

:: Fetch the auth data from Pastebin and check the key
set "login_success=false"
for /f "tokens=1,* delims=:" %%a in ('curl -s "%auth_url%"') do (
    set "line_key=%%a"
    if /i "!line_key:~0,10!"=="!user_key:~0,10!" (
        set "user=%%b"
        set "login_success=true"
        goto :auth_done
    )
)

:auth_done
if "%login_success%"=="true" goto success

cls
echo [!] Invalid Key. Please try again... [!]
pause
goto menu


:success
title Multi Tool - Currently Logged in as [%user%]
cls
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║                                               ║
echo ║       1 - Executor                            ║
echo ║       2 - ScriptHub                           ║
echo ║       3 - Credits                             ║
echo ║       4 - Exit                                ║
echo ║                                               ║
echo ╚═══════════════════════════════════════════════╝
echo.

set /p a=Select an option [%user%]: 
if "%a%"=="1" goto one
if "%a%"=="2" goto two
if "%a%"=="3" goto three
if "%a%"=="4" goto four

echo [!] Invalid Choice. Please try again... [!]
pause
goto success

:one
cls
set /p "script_input=Execute the require script [%user%]: "
set "final_script=!script_input:RBLX_USERNAME=%user%!"
echo Executing script...
curl -s -X POST -H "Content-Type: application/json" -d "{\"script\":\"!final_script!\"}" %server_url%/key/%gameID% >nul
cls
echo Successfully Executed
pause
goto success

:two
cls
echo Script Hub - Select a script to execute:
echo ------------------------------------------
echo 1) Dex.
echo 2) Respawn.
echo 3) R6.
echo 4) Katanirst.
echo 5) Refinery.
echo 6) The Button.
echo 7) War Helicopter.
echo 8) FakeVR.
echo 9) Infinite Yield.
echo 10) Reality Glitcher.
echo 11) CHANCE.
echo 12) Tesseract.
echo 13) Banana.
echo 14) Mr Bye Bye.
echo 15) Mr Bye Bye Mini.
echo 16) Mr Bye Bye Giant.
echo 17) Lost Psygen.
echo 18) Ban Hammer.
echo 19) Lunatic.
echo 20) Reality Orb.
echo 21) Siren Head.
echo 22) SledgeHammer.
echo 23) Mystic Tools.
echo 24) Topkek V3.
echo 25) K00pkidd gui.
echo 26) doges.
echo 27) RopeWeb.
echo 28) Wasp Fighter Jet.
echo 29) Wild Katana.
echo 30) Gun Journer.
echo 31) Bow Master.
echo 32) Abyss Eye.
echo 33) Wiron.
echo 34) Road Rogue.
echo 35) Tiny Infernous.
echo ------------------------------------------
echo.
set /p "hub_choice=Select a script [%user%]: "

set "selected_script="
if "%hub_choice%"=="1" set "selected_script=require(14572394952)('RBLX_USERNAME') wait(5) game:GetService('Players').Name = 'Players'"
if "%hub_choice%"=="2" set "selected_script=game:GetService('Players').RBLX_USERNAME:LoadCharacter()"
if "%hub_choice%"=="3" set "selected_script=require(3436957371):r6('RBLX_USERNAME')"
if "%hub_choice%"=="4" set "selected_script=require(8038057972).CLoad('RBLX_USERNAME')"
if "%hub_choice%"=="5" set "selected_script=require(14080317322).Refinary()"
if "%hub_choice%"=="6" set "selected_script=require(14314013653):button('RBLX_USERNAME')"
if "%hub_choice%"=="7" set "selected_script=require(12620186035).Huey('RBLX_USERNAME')"
if "%hub_choice%"=="8" set "selected_script=require(6223977609)['FakeVr']('RBLX_USERNAME')"
if "%hub_choice%"=="9" set "selected_script=require(12151433701)('RBLX_USERNAME')"
if "%hub_choice%"=="10" set "selected_script=require(6223977609)['RealityGlitcher']('RBLX_USERNAME')"
if "%hub_choice%"=="11" set "selected_script=require(6223977609)['Chance']('RBLX_USERNAME')"
if "%hub_choice%"=="12" set "selected_script=require(6223977609)['Tesseract']('RBLX_USERNAME')"
if "%hub_choice%"=="13" set "selected_script=require(6223977609)['Banana']('RBLX_USERNAME')"
if "%hub_choice%"=="14" set "selected_script=require(6515226671).load('RBLX_USERNAME') "
if "%hub_choice%"=="15" set "selected_script=require(5629629397).load('RBLX_USERNAME') "
if "%hub_choice%"=="16" set "selected_script=require(5630545228).load('RBLX_USERNAME') "
if "%hub_choice%"=="17" set "selected_script=require(6223977609)['Lost Psygen']('RBLX_USERNAME')"
if "%hub_choice%"=="18" set "selected_script=require(5448035802).Hammer('RBLX_USERNAME','BanHammer')"
if "%hub_choice%"=="19" set "selected_script=require(5813708464).load('RBLX_USERNAME')"
if "%hub_choice%"=="20" set "selected_script=require(4780399515).load('RBLX_USERNAME')"
if "%hub_choice%"=="21" set "selected_script=require(5239955586).Dark('RBLX_USERNAME')"
if "%hub_choice%"=="22" set "selected_script=require(8038037940).CLoad('RBLX_USERNAME')"
if "%hub_choice%"=="23" set "selected_script=require(4780399515).load('RBLX_USERNAME')"
if "%hub_choice%"=="24" set "selected_script=require(2609384717).load('RBLX_USERNAME')"
if "%hub_choice%"=="25" set "selected_script=require(12313085498).pipiu('RBLX_USERNAME')"
if "%hub_choice%"=="26" set "selected_script=require(5115249013).fehack('RBLX_USERNAME')"
if "%hub_choice%"=="27" set "selected_script=require(15884743161).RopeBall('RBLX_USERNAME')"
if "%hub_choice%"=="28" set "selected_script=require(5860060462).load('RBLX_USERNAME')"
if "%hub_choice%"=="29" set "selected_script=require(14175063457)('RBLX_USERNAME')"
if "%hub_choice%"=="30" set "selected_script=require(14175074837)('RBLX_USERNAME')"
if "%hub_choice%"=="31" set "selected_script=require(14175067340)('RBLX_USERNAME')"
if "%hub_choice%"=="32" set "selected_script=require(14175105993)('RBLX_USERNAME')"
if "%hub_choice%"=="33" set "selected_script=require(7972125129).CLoad('RBLX_USERNAME')"
if "%hub_choice%"=="34" set "selected_script=require(7473216460).load('RBLX_USERNAME')"
if "%hub_choice%"=="35" set "selected_script=require(8828734242)('RBLX_USERNAME')"

if not defined selected_script (
    echo [!] Invalid Choice. Please try again... [!]
    pause
    goto two
)

set "final_script=!selected_script:RBLX_USERNAME=%user%!"
echo Executing script...
curl -s -X POST -H "Content-Type: application/json" -d "{\"script\":\"!final_script!\"}" %server_url%/key/%gameID% >nul
cls
echo Successfully Executed
pause
goto success


:three
cls
echo Made by LevelDevide
pause
goto success


:four
exit