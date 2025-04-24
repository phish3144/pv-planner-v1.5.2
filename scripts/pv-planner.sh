#!/bin/bash

# PV-Planer Installations- und Verwaltungsskript
# Version 1.6.0

# Konfiguration
APP_NAME="PV-Planer"
APP_DIR="/opt/pv-planner"
SERVICE_NAME="pv-planner"
LOG_FILE="/var/log/pv-planner.log"
PORT=80

# Farben für Ausgaben
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Hilfefunktion
show_help() {
    echo -e "${GREEN}PV-Planer Verwaltungsskript v1.6.0${NC}"
    echo ""
    echo "Verwendung: $0 [Befehl]"
    echo ""
    echo "Befehle:"
    echo "  install    - Installiert die Anwendung"
    echo "  uninstall  - Deinstalliert die Anwendung"
    echo "  start      - Startet die Anwendung"
    echo "  stop       - Stoppt die Anwendung"
    echo "  status     - Zeigt den Status der Anwendung"
    echo "  help       - Zeigt diese Hilfe an"
    echo ""
}

# Prüfen, ob das Skript als Root ausgeführt wird
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}Fehler: Dieses Skript muss als Root ausgeführt werden.${NC}"
        echo "Bitte mit 'sudo $0 $1' erneut ausführen."
        exit 1
    fi
}

# Installation
install_app() {
    echo -e "${GREEN}[${APP_NAME}] Installiere ${APP_NAME}...${NC}"
    
    # Prüfen, ob die Anwendung bereits installiert ist
    if [ -d "$APP_DIR" ]; then
        echo -e "${YELLOW}Die Anwendung ist bereits installiert. Möchten Sie sie aktualisieren? (j/n)${NC}"
        read -r answer
        if [ "$answer" != "j" ]; then
            echo "Installation abgebrochen."
            exit 0
        fi
        
        # Stoppe den Service, falls er läuft
        systemctl stop ${SERVICE_NAME} 2>/dev/null
    fi
    
    # Erstelle Anwendungsverzeichnis
    mkdir -p $APP_DIR
    
    # Kopiere Anwendungsdateien
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PARENT_DIR="$(dirname "$SCRIPT_DIR")"
    cp -r $PARENT_DIR/* $APP_DIR/
    
    # Installiere Abhängigkeiten
    cd $APP_DIR
    npm install --production
    
    # Erstelle systemd Service
    cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=PV-Planer Service
After=network.target

[Service]
ExecStart=/usr/bin/node ${APP_DIR}/server.js
WorkingDirectory=${APP_DIR}
Restart=always
User=root
Environment=NODE_ENV=production PORT=${PORT}
StandardOutput=append:${LOG_FILE}
StandardError=append:${LOG_FILE}

[Install]
WantedBy=multi-user.target
EOF
    
    # Aktiviere und starte den Service
    systemctl daemon-reload
    systemctl enable ${SERVICE_NAME}
    systemctl start ${SERVICE_NAME}
    
    # Erstelle symbolischen Link für einfachen Zugriff
    ln -sf ${APP_DIR}/scripts/pv-planner.sh /usr/local/bin/pv-planner
    
    echo -e "${GREEN}[${APP_NAME}] Installation abgeschlossen!${NC}"
    echo -e "Sie können die Anwendung unter http://localhost:${PORT} aufrufen."
    echo -e "Verwenden Sie 'pv-planner status', um den Status zu überprüfen."
}

# Deinstallation
uninstall_app() {
    echo -e "${YELLOW}[${APP_NAME}] Möchten Sie ${APP_NAME} wirklich deinstallieren? (j/n)${NC}"
    read -r answer
    if [ "$answer" != "j" ]; then
        echo "Deinstallation abgebrochen."
        exit 0
    fi
    
    echo -e "${GREEN}[${APP_NAME}] Deinstalliere ${APP_NAME}...${NC}"
    
    # Stoppe und deaktiviere den Service
    systemctl stop ${SERVICE_NAME} 2>/dev/null
    systemctl disable ${SERVICE_NAME} 2>/dev/null
    
    # Entferne Service-Datei
    rm -f /etc/systemd/system/${SERVICE_NAME}.service
    systemctl daemon-reload
    
    # Entferne symbolischen Link
    rm -f /usr/local/bin/pv-planner
    
    # Entferne Anwendungsverzeichnis
    rm -rf $APP_DIR
    
    # Entferne Log-Datei
    rm -f $LOG_FILE
    
    echo -e "${GREEN}[${APP_NAME}] Deinstallation abgeschlossen!${NC}"
}

# Starten der Anwendung
start_app() {
    echo -e "${GREEN}[${APP_NAME}] Starte ${APP_NAME}...${NC}"
    
    # Prüfen, ob die Anwendung installiert ist
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}Fehler: ${APP_NAME} ist nicht installiert.${NC}"
        echo "Bitte führen Sie zuerst 'sudo $0 install' aus."
        exit 1
    fi
    
    # Starte den Service
    systemctl start ${SERVICE_NAME}
    
    # Prüfe, ob der Service erfolgreich gestartet wurde
    if systemctl is-active --quiet ${SERVICE_NAME}; then
        echo -e "${GREEN}[${APP_NAME}] ${APP_NAME} wurde erfolgreich gestartet!${NC}"
        echo -e "Sie können die Anwendung unter http://localhost:${PORT} aufrufen."
    else
        echo -e "${RED}Fehler: ${APP_NAME} konnte nicht gestartet werden.${NC}"
        echo "Überprüfen Sie die Logs mit 'journalctl -u ${SERVICE_NAME}'."
        exit 1
    fi
}

# Stoppen der Anwendung
stop_app() {
    echo -e "${GREEN}[${APP_NAME}] Stoppe ${APP_NAME}...${NC}"
    
    # Prüfen, ob die Anwendung installiert ist
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}Fehler: ${APP_NAME} ist nicht installiert.${NC}"
        exit 1
    fi
    
    # Stoppe den Service
    systemctl stop ${SERVICE_NAME}
    
    # Prüfe, ob der Service erfolgreich gestoppt wurde
    if ! systemctl is-active --quiet ${SERVICE_NAME}; then
        echo -e "${GREEN}[${APP_NAME}] ${APP_NAME} wurde erfolgreich gestoppt!${NC}"
    else
        echo -e "${RED}Fehler: ${APP_NAME} konnte nicht gestoppt werden.${NC}"
        echo "Überprüfen Sie die Logs mit 'journalctl -u ${SERVICE_NAME}'."
        exit 1
    fi
}

# Status der Anwendung
show_status() {
    echo -e "${GREEN}[${APP_NAME}] Status:${NC}"
    
    # Prüfen, ob die Anwendung installiert ist
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${YELLOW}${APP_NAME} ist nicht installiert.${NC}"
        exit 0
    fi
    
    # Zeige Service-Status
    if systemctl is-active --quiet ${SERVICE_NAME}; then
        echo -e "${GREEN}${APP_NAME} läuft.${NC}"
        echo -e "URL: http://localhost:${PORT}"
        echo -e "Version: $(cat ${APP_DIR}/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')"
        echo -e "Installationsverzeichnis: ${APP_DIR}"
        echo -e "Log-Datei: ${LOG_FILE}"
    else
        echo -e "${YELLOW}${APP_NAME} ist installiert, läuft aber nicht.${NC}"
        echo -e "Starten Sie die Anwendung mit 'sudo $0 start'."
    fi
}

# Hauptfunktion
main() {
    # Wenn kein Argument angegeben wurde, zeige Hilfe
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    # Verarbeite Befehle
    case "$1" in
        install)
            check_root "$1"
            install_app
            ;;
        uninstall)
            check_root "$1"
            uninstall_app
            ;;
        start)
            check_root "$1"
            start_app
            ;;
        stop)
            check_root "$1"
            stop_app
            ;;
        status)
            show_status
            ;;
        help)
            show_help
            ;;
        *)
            echo -e "${RED}Unbekannter Befehl: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Starte Hauptfunktion mit allen übergebenen Argumenten
main "$@"
