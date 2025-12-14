const fs = require('fs');
const path = require('path');

/**
 * Generates a beautiful HTML status report for UPS
 * @param {string} ip - UPS IP address
 * @param {Object} data - UPS status data from home.json
 * @returns {string} - Complete HTML content
 */
function generateStatusHTML(ip, data) {
    const mode = data.Other.upsSupplyState === "1" ? "Bypass" :
        data.Other.upsSupplyState === "2" ? "Inverter" :
            data.Other.upsSupplyState === "3" ? "Union" : "None";

    const modeColor = data.Other.upsSupplyState === "2" ? "#28a745" : // Green for Inverter
        data.Other.upsSupplyState === "1" ? "#ffc107" : // Yellow for Bypass
            "#dc3545"; // Red for others

    const batteryColor = Number(data.Battery.Cap) > 80 ? "#28a745" :
        Number(data.Battery.Cap) > 50 ? "#ffc107" : "#dc3545";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UPS Status Report - ${ip}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header .ip { font-size: 18px; opacity: 0.9; }
        .header .timestamp {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 10px;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .status-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #667eea;
        }
        .status-card h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .status-card .icon { font-size: 20px; }
        .status-value {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .status-label {
            font-size: 14px;
            color: #666;
        }
        .mode-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 18px;
            background: ${modeColor};
            color: white;
        }
        .battery-section {
            padding: 0 30px 30px 30px;
        }
        .battery-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 40px;
            overflow: hidden;
            position: relative;
            margin-top: 10px;
        }
        .battery-fill {
            height: 100%;
            background: ${batteryColor};
            width: ${data.Battery.Cap}%;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
        }
        table tr:last-child td {
            border-bottom: none;
        }
        table tr:hover {
            background: #f8f9fa;
        }
        .phase-data {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            text-align: center;
        }
        .phase-data div {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
        }
        .phase-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .phase-value {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
        }
        .alert-section {
            padding: 0 30px 30px 30px;
        }
        .alert-box {
            display: flex;
            gap: 20px;
            justify-content: center;
        }
        .alert-item {
            background: ${Number(data.Other.Log_CurAlarmCnt) > 0 ? '#fff3cd' : '#d4edda'};
            border: 2px solid ${Number(data.Other.Log_CurAlarmCnt) > 0 ? '#ffc107' : '#28a745'};
            border-radius: 10px;
            padding: 15px 30px;
            text-align: center;
        }
        .alert-count {
            font-size: 32px;
            font-weight: bold;
            color: ${Number(data.Other.Log_CurAlarmCnt) > 0 ? '#856404' : '#155724'};
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 UPS Status Report</h1>
            <div class="ip">🖥️ ${ip}</div>
            <div class="timestamp">⏰ Generated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="status-grid">
            <div class="status-card">
                <h3><span class="icon">🔌</span> Operating Mode</h3>
                <div style="margin-top: 10px;">
                    <span class="mode-badge">${mode}</span>
                </div>
            </div>

            <div class="status-card">
                <h3><span class="icon">⚡</span> Load</h3>
                <div class="status-value">${data.Load.LoadPercnt.A}%</div>
                <div class="status-label">Current Load</div>
            </div>

            <div class="status-card">
                <h3><span class="icon">🌡️</span> Temperature</h3>
                <div class="status-value">${data.Other.envTemp}°C</div>
                <div class="status-label">Environment</div>
            </div>

            <div class="status-card">
                <h3><span class="icon">⏱️</span> Backup Time</h3>
                <div class="status-value">${Math.round(Number(data.Battery.BkupTime))}</div>
                <div class="status-label">Minutes</div>
            </div>
        </div>

        <div class="battery-section">
            <h3 style="color: #333; margin-bottom: 10px;">🔋 Battery Status</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-weight: bold; color: #666;">Status: ${data.Battery.Sta.P}</span>
                <span style="font-weight: bold; color: ${batteryColor};">${data.Battery.Cap}%</span>
            </div>
            <div class="battery-bar">
                <div class="battery-fill">${data.Battery.Cap}%</div>
            </div>
        </div>

        <div style="padding: 0 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">📥 Input</h3>
            <div class="phase-data">
                <div>
                    <div class="phase-label">Phase A</div>
                    <div class="phase-value">${data.Input.L_N_Volt.A}V</div>
                    <div class="phase-label">${data.Input.L_N_Curr.A}A</div>
                </div>
                <div>
                    <div class="phase-label">Phase B</div>
                    <div class="phase-value">${data.Input.L_N_Volt.B}V</div>
                    <div class="phase-label">${data.Input.L_N_Curr.B}A</div>
                </div>
                <div>
                    <div class="phase-label">Phase C</div>
                    <div class="phase-value">${data.Input.L_N_Volt.C}V</div>
                    <div class="phase-label">${data.Input.L_N_Curr.C}A</div>
                </div>
            </div>
        </div>

        <div style="padding: 20px 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">📤 Output</h3>
            <div class="phase-data">
                <div>
                    <div class="phase-label">Phase A</div>
                    <div class="phase-value">${data.Output.L_N_Volt.A}V</div>
                    <div class="phase-label">${data.Output.L_N_Curr.A}A</div>
                </div>
                <div>
                    <div class="phase-label">Phase B</div>
                    <div class="phase-value">${data.Output.L_N_Volt.B}V</div>
                    <div class="phase-label">${data.Output.L_N_Curr.B}A</div>
                </div>
                <div>
                    <div class="phase-label">Phase C</div>
                    <div class="phase-value">${data.Output.L_N_Volt.C}V</div>
                    <div class="phase-label">${data.Output.L_N_Curr.C}A</div>
                </div>
            </div>
        </div>

        <div class="alert-section">
            <h3 style="color: #333; margin-bottom: 15px; text-align: center;">⚠️ System Status</h3>
            <div class="alert-box">
                <div class="alert-item">
                    <div class="alert-count">${data.Other.Log_CurAlarmCnt}</div>
                    <div>Active Alarms</div>
                </div>
                <div class="alert-item" style="background: ${Number(data.Other.Log_CurFaultCnt) > 0 ? '#f8d7da' : '#d4edda'}; border-color: ${Number(data.Other.Log_CurFaultCnt) > 0 ? '#dc3545' : '#28a745'};">
                    <div class="alert-count" style="color: ${Number(data.Other.Log_CurFaultCnt) > 0 ? '#721c24' : '#155724'};">${data.Other.Log_CurFaultCnt}</div>
                    <div>Active Faults</div>
                </div>
            </div>
        </div>

        <div class="footer">
            Generated by UPS WhatsApp Bot 🤖<br>
            Product: ${data.Other.PrdType || 'N/A'}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Saves HTML to temporary file
 * @param {string} html - HTML content
 * @param {string} ip - UPS IP for filename
 * @returns {string} - File path
 */
function saveHTMLToFile(html, ip) {
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ups-status-${ip}-${timestamp}.html`;
    const filepath = path.join(tempDir, filename);

    fs.writeFileSync(filepath, html, 'utf8');
    return filepath;
}

module.exports = { generateStatusHTML, saveHTMLToFile };
