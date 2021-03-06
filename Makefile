include .env

.PHONY: deploy log-command log-motion-activated log-motion-deactivated log-photo

deploy:
	@echo "deploy project"
	serverless deploy

log-motion-activated:
	@echo "get motion activated logging"
	serverless logs -f telegramMotionActivated -t

log-motion-deactivated:
	@echo "get motion deactivated logging"
	serverless logs -f telegramMotionDeactivated -t

log-command:
	@echo "get comand logging"
	serverless logs -f telegramCommand -t

log-photo:
	@echo "get photo logging"
	serverless logs -f telegramSendPhoto -t
