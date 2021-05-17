@echo off && cls
set image=douglasdomingues/locale-editor
set TAG=latest
IF [%1] NEQ [] SET TAG=%1
set full_tag=%image%:%tag%
docker image build . -t %full_tag%
docker image push %full_tag%

@echo on