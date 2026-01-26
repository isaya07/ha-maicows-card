const e=customElements.get("hui-masonry-view")?Object.getPrototypeOf(customElements.get("hui-masonry-view")):Object.getPrototypeOf(customElements.get("hui-view")),t=e.prototype.html,i=e.prototype.css,o={en:{efficiency:"Efficiency",temp_outdoor:"Outdoor Air",temp_exhaust:"Exhaust Air",temp_extract:"Extract Air",temp_supply:"Supply Air",open:"Open",closed:"Closed",filter_device:"Device Filter",filter_outdoor:"Outdoor Filter",filter_room:"Room Filter",mode_off:"Off",mode_auto:"Humidity",mode_low:"Reduced",mode_medium:"Normal",mode_high:"Intensive",power:"Power",ventilation:"Ventilation",boost:"Boost"},fr:{efficiency:"Rendement",temp_outdoor:"Air ext",temp_exhaust:"Air rejeté",temp_extract:"Air extrait",temp_supply:"Air insufflé",open:"Ouvert",closed:"Fermé",filter_device:"Filtre appareil",filter_outdoor:"Filtre extérieur",filter_room:"Filtre pièce",mode_off:"Arrêt",mode_auto:"Humidité",mode_low:"Réduit",mode_medium:"Normal",mode_high:"Intensif",power:"Alimentation",ventilation:"Ventilation",boost:"Surventilation"},de:{efficiency:"Wirkungsgrad",temp_outdoor:"Außenluft",temp_exhaust:"Fortluft",temp_extract:"Abluft",temp_supply:"Zuluft",open:"Offen",closed:"Geschlossen",filter_device:"Gerätefilter",filter_outdoor:"Außenfilter",filter_room:"Raumfilter",mode_off:"Aus",mode_auto:"Feuchte",mode_low:"Reduziert",mode_medium:"Normal",mode_high:"Intensiv",power:"Stromversorgung",ventilation:"Lüftung",boost:"Stoßlüftung"}};customElements.define("maico-vmc-card",class extends e{static get properties(){return{hass:{type:Object},config:{type:Object},_entities:{type:Object},_history:{type:Array},_drawerOpen:{type:Boolean}}}_localize(e){const t=this.hass?.language||"en";return o[t]&&o[t][e]||o.en[e]||e}constructor(){super(),this._history=[],this._historyInterval=null,this._drawerOpen=!1}static getConfigElement(){return document.createElement("maico-vmc-card-editor")}static getStubConfig(){return{name:"VMC",show_efficiency:!0,show_graph:!0,graph_hours:24}}setConfig(e){this.config={name:e.name||"VMC",show_efficiency:!1!==e.show_efficiency,show_graph:!1!==e.show_graph,graph_hours:e.graph_hours||24,graph_color:e.graph_color||"var(--accent-color, var(--primary-color))",show_humidity:!1!==e.show_humidity,show_fan_mode:!1!==e.show_fan_mode,climate_entity:e.climate_entity||null,...e}}connectedCallback(){super.connectedCallback(),this.config?.show_graph&&(this._fetchHistory(),this._historyInterval=setInterval(()=>this._fetchHistory(),3e5))}disconnectedCallback(){super.disconnectedCallback(),this._historyInterval&&clearInterval(this._historyInterval)}async _fetchHistory(){const e=this._discoverEntities();if(!e.humidity||!this.hass)return;const t=(new Date).toISOString(),i=new Date(Date.now()-60*this.config.graph_hours*60*1e3).toISOString();try{const o=`history/period/${i}?filter_entity_id=${e.humidity}&end_time=${t}&minimal_response&no_attributes`,n=await this.hass.callApi("GET",o);n&&n[0]&&(this._history=n[0].filter(e=>!isNaN(parseFloat(e.state))).map(e=>({time:new Date(e.last_changed).getTime(),value:parseFloat(e.state)})),this.requestUpdate())}catch(e){console.warn("Failed to fetch history:",e)}}_generateGraphPath(){if(!this._history||this._history.length<2)return"";let e=this._history;if(e.length>30){const t=Math.ceil(e.length/30);e=e.filter((i,o)=>o%t===0||o===e.length-1)}const t=e.map(e=>e.value),i=Math.min(...t)-5,o=Math.max(...t)+5-i||1,n=e.map((t,n)=>({x:5+n/(e.length-1)*390,y:75-(t.value-i)/o*70}));let a=`M ${n[0].x},${n[0].y}`;for(let e=0;e<n.length-1;e++){const t=n[0===e?e:e-1],i=n[e],o=n[e+1],s=n[e+2>=n.length?e+1:e+2],r=.25;a+=` C ${i.x+(o.x-t.x)*r},${i.y+(o.y-t.y)*r} ${o.x-(s.x-i.x)*r},${o.y-(s.y-i.y)*r} ${o.x},${o.y}`}return{line:a,fill:`${a} L ${n[n.length-1].x},80 L 5,80 Z`}}_discoverEntities(){if(!this.hass)return{};const e={},t=Object.keys(this.hass.states);return e.climate=this.config.climate_entity||t.find(e=>e.startsWith("climate.maico")),e.temp_inlet=t.find(e=>e.includes("maico")&&(e.includes("entrant")||e.includes("inlet")||e.includes("air_entrant")||e.includes("lufteintritt"))),e.temp_exhaust=t.find(e=>e.includes("maico")&&(e.includes("rejete")||e.includes("exhaust")||e.includes("air_rejete")||e.includes("fortluft"))),e.temp_extract=t.find(e=>e.includes("maico")&&(e.includes("extrait")||e.includes("extract")||e.includes("air_extrait")||e.includes("abluft"))),e.temp_supply=t.find(e=>e.includes("maico")&&e.startsWith("sensor.")&&(e.includes("souffle")||e.includes("supply_air_temp")||e.includes("zuluft"))&&!e.includes("fan")&&!e.includes("ventilateur")&&!e.includes("geschwindigkeit")),e.temp_room=t.find(e=>e.includes("maico")&&(e.includes("ambiant")||e.includes("room_temp")||e.includes("raumtemperatur"))),e.humidity=t.find(e=>e.includes("maico")&&(e.includes("humidite")||e.includes("humidity")||e.includes("feuchtigkeit"))),e.efficiency=t.find(e=>e.includes("maico")&&(e.includes("rendement")||e.includes("efficiency")||e.includes("effizienz"))),e.fan=t.find(e=>e.startsWith("fan.maico")),e.bypass=t.find(e=>e.includes("maico")&&(e.includes("bypass")||e.includes("etat_bypass"))),e.filter_device=t.find(e=>e.includes("maico")&&(e.includes("filter_device")||e.includes("filtre_appareil")||e.includes("geratefilter"))&&(e.includes("days")||e.includes("jours")||e.includes("restant")||e.includes("verbleibend"))),e.filter_outdoor=t.find(e=>e.includes("maico")&&(e.includes("filter_outdoor")||e.includes("filtre_exterieur")||e.includes("filtre_ext")||e.includes("aussenfilter"))&&(e.includes("days")||e.includes("jours")||e.includes("restant")||e.includes("verbleibend"))),e.filter_room=t.find(e=>e.includes("maico")&&(e.includes("filter_room")||e.includes("filtre_piece")||e.includes("filtre_interieur")||e.includes("raumfilter"))&&(e.includes("days")||e.includes("jours")||e.includes("restant")||e.includes("verbleibend"))),e.power_switch=t.find(e=>e.startsWith("switch.maico")&&(e.includes("power")||e.includes("alimentation")||e.includes("stromversorgung"))),e.boost_switch=t.find(e=>e.startsWith("switch.maico")&&(e.includes("boost")||e.includes("surventilation"))),e}_getState(e){if(!e||!this.hass.states[e])return"—";const t=this.hass.states[e].state;return"unavailable"===t||"unknown"===t?"—":t}_getAttribute(e,t){return e&&this.hass.states[e]?this.hass.states[e].attributes[t]:null}_getFanModeLabel(e){return{off:this._localize("mode_off"),auto:this._localize("mode_auto"),low:this._localize("mode_low"),medium:this._localize("mode_medium"),high:this._localize("mode_high")}[e]||e||"—"}_calculateEfficiency(e){if(e.efficiency)return this._getState(e.efficiency);const t=parseFloat(this._getState(e.temp_inlet)),i=parseFloat(this._getState(e.temp_supply)),o=parseFloat(this._getState(e.temp_extract));if(isNaN(t)||isNaN(i)||isNaN(o))return"—";return((i-t)/(o-t)*100).toFixed(1)}_handleFanUp(){const e=this._discoverEntities();if(!e.climate)return;const t=["off","low","medium","high"],i=this._getAttribute(e.climate,"fan_mode")||"low",o=t.indexOf(i),n=Math.min(o+1,t.length-1);this.hass.callService("climate","set_fan_mode",{entity_id:e.climate,fan_mode:t[n]})}_handleFanDown(){const e=this._discoverEntities();if(!e.climate)return;const t=["off","low","medium","high"],i=this._getAttribute(e.climate,"fan_mode")||"low",o=t.indexOf(i),n=Math.max(o-1,0);this.hass.callService("climate","set_fan_mode",{entity_id:e.climate,fan_mode:t[n]})}_handleMoreInfo(){const e=this._discoverEntities(),t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e.climate||e.fan}});this.dispatchEvent(t)}_toggleDrawer(){this._drawerOpen=!this._drawerOpen}_handlePower(){const e=this._discoverEntities();e.power_switch&&this.hass.callService("switch","toggle",{entity_id:e.power_switch})}_handleVentilation(){const e=this._discoverEntities();e.fan&&this.hass.callService("fan","toggle",{entity_id:e.fan})}_handleBoost(){const e=this._discoverEntities();e.boost_switch&&this.hass.callService("switch","toggle",{entity_id:e.boost_switch})}render(){if(!this.hass)return t``;const e=this._discoverEntities(),i=e.climate?this.hass.states[e.climate]:null,o=this._calculateEfficiency(e),n=i?.attributes?.current_temperature||this._getState(e.temp_room),a=this._getState(e.humidity),s=i?.attributes?.fan_mode||"—",r=this._getState(e.bypass),c=this._getState(e.filter_device),l=this._getState(e.filter_outdoor),d=this._getState(e.filter_room),h=this._generateGraphPath();return t`
      <ha-card>
        <!-- Background graph -->
        ${this.config.show_graph&&h?t`
              <div class="graph-background">
                <svg viewBox="0 0 400 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:${this.config.graph_color};stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:${this.config.graph_color};stop-opacity:0.05" />
                    </linearGradient>
                  </defs>
                  <path d="${h.fill}" fill="url(#graphGradient)" />
                  <path d="${h.line}" fill="none" stroke="${this.config.graph_color}" stroke-width="2" stroke-opacity="0.5" />
                </svg>
              </div>
            `:""}

        <div class="card-body">
          <div class="main-section">
            <div class="card-header" @click="${this._handleMoreInfo}">
              <div class="header-left">
                <span class="name">${this.config.name}</span>
              </div>
              <div class="header-center">
                ${this.config.show_efficiency?t`
                      <span class="efficiency" title="${this._localize("efficiency")}">
                        <ha-icon icon="mdi:gauge"></ha-icon>
                        ${o} %
                      </span>
                    `:""}
              </div>
              <div class="header-right"></div>
            </div>

            <div class="card-content">
              <!-- Left temperatures -->
              <div class="temp-info left-top">
                <span class="temp-label">${this._localize("temp_outdoor")}</span>
                <span class="temp-value">${this._getState(e.temp_inlet)}</span>
              </div>
              <div class="temp-info left-bottom">
                <span class="temp-label">${this._localize("temp_exhaust")}</span>
                <span class="temp-value">${this._getState(e.temp_exhaust)}</span>
              </div>

              <!-- Heat exchanger SVG -->
              <div class="exchanger" .innerHTML="${'\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">\n    <g transform="matrix(0.62 0 0 0.53 24 25)">\n        <path style="stroke: rgb(114,114,114); stroke-width: 3; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(242,242,242); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M 16.23943 -28.12732 L 32.47864 0 L 16.23943 28.12732 L -16.23943 28.12732 L -32.47864 0 L -16.23943 -28.12732 z" stroke-linecap="round" />\n    </g>\n    <g transform="matrix(0.2 0 0 0.3 25.5 24)">\n        <path style="stroke: rgb(49,168,247); stroke-width: 4; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -110 40 L -90 40 L 90 -40 L 110 -40" stroke-linecap="round" />\n    </g>\n    <g transform="matrix(0 -0.1 0.06 0 2.5 36)">\n        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(49,168,247); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" />\n    </g>\n    <g transform="matrix(0 -0.1 -0.06 0 47.5 36)">\n        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(49,168,247); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" />\n    </g>\n    <g transform="matrix(-0.19 0 0 0.3 24 24)">\n        <path style="stroke: rgb(49,168,247); stroke-width: 4; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -110 40 L -90 40 L 90 -40 L 110 -40" stroke-linecap="round" />\n    </g>\n</svg>\n'}"></div>

              <!-- Right temperatures -->
              <div class="temp-info right-top">
                <span class="temp-label">${this._localize("temp_extract")}</span>
                <span class="temp-value">${this._getState(e.temp_extract)}</span>
              </div>
              <div class="temp-info right-bottom">
                <span class="temp-label">${this._localize("temp_supply")}</span>
                <span class="temp-value">${this._getState(e.temp_supply)}</span>
              </div>
            </div>
          </div>

          <!-- Side info column -->
          <div class="side-section">
            <div class="side-info">
              <div class="info-item">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                <span>${n}</span>
              </div>
              ${this.config.show_humidity?t`
                    <div class="info-item humidity">
                      <ha-icon icon="mdi:water-percent"></ha-icon>
                      <span>${a}</span>
                    </div>
                  `:""}
              ${this.config.show_fan_mode?t`
                    <div class="info-item fan">
                      <ha-icon
                        icon="mdi:fan"
                        class="${"off"!==s?"spinning":""}"
                      ></ha-icon>
                      <span>${this._getFanModeLabel(s)}</span>
                    </div>
                  `:""}
            </div>
          </div>

          <!-- Control buttons column with drawer -->
          <div class="controls-section">
            <div class="controls-wrapper ${this._drawerOpen?"drawer-open":""}">
              <!-- Drawer panel -->
              <div class="drawer">
                <button class="drawer-btn ${"on"===this._getState(e.power_switch)?"active":""}" 
                        @click="${this._handlePower}" 
                        title="${this._localize("power")}">
                  <ha-icon icon="mdi:power"></ha-icon>
                </button>
                <button class="drawer-btn ${"on"===this._getState(e.fan)?"active":""}" 
                        @click="${this._handleVentilation}"
                        title="${this._localize("ventilation")}">
                  <ha-icon icon="mdi:fan"></ha-icon>
                </button>
                <button class="drawer-btn ${"on"===this._getState(e.boost_switch)?"active boost":""}" 
                        @click="${this._handleBoost}"
                        title="${this._localize("boost")}">
                  <ha-icon icon="mdi:fan-speed-3"></ha-icon>
                </button>
              </div>
              <!-- Main controls -->
              <div class="controls">
                <button class="control-btn" @click="${this._handleFanUp}">
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button class="control-btn" @click="${this._toggleDrawer}">
                  <ha-icon icon="mdi:menu"></ha-icon>
                </button>
                <button class="control-btn" @click="${this._handleFanDown}">
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer row with bypass and filters -->
        <div class="card-footer">
          ${"—"!==r?t`
                <div class="footer-item bypass ${"on"===r?"open":"closed"}">
                  <ha-icon icon="mdi:valve"></ha-icon>
                  <span>${"on"===r?this._localize("open"):this._localize("closed")}</span>
                </div>
              `:""}
          ${"—"!==c?t`
                <div class="footer-item filter ${parseInt(c)<30?"warning":""}">
                  <ha-icon icon="mdi:air-filter"></ha-icon>
                  <span title="${this._localize("filter_device")}">${c}j</span>
                </div>
              `:""}
          ${"—"!==l?t`
                <div class="footer-item filter ${parseInt(l)<30?"warning":""}">
                  <ha-icon icon="mdi:weather-windy"></ha-icon>
                  <span title="${this._localize("filter_outdoor")}">${l}j</span>
                </div>
              `:""}
          ${"—"!==d?t`
                <div class="footer-item filter ${parseInt(d)<30?"warning":""}">
                  <ha-icon icon="mdi:home-outline"></ha-icon>
                  <span title="${this._localize("filter_room")}">${d}j</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}static get styles(){return i`
      :host {
        --vmc-primary: var(--primary-color);
        --vmc-info: var(--info-color, #039be5);
        display: block;
        height: 100%;
        container-type: size;
      }

      ha-card {
        padding: 8px;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .graph-background {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 40%; /* Responsive height */
        min-height: 80px;
        pointer-events: none;
        z-index: 0;
      }

      .graph-background svg {
        width: 100%;
        height: 100%;
      }

      .card-body {
        display: flex;
        flex: 1;
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 0;
        padding-bottom: 2px;
      }

      .main-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 12px 6px 12px 12px;
        min-width: 0;
      }

      .controls-section {
        width: 60px; /* Reserve space for closed controls */
        padding: 12px 6px 12px 0;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        position: relative;
        z-index: 20;
        margin-right: 6px;
      }

      .side-section {
        width: auto;
        padding: 12px 6px 12px 0;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
      }

      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
        min-height: 24px;
        gap: 8px;
      }
      
      .header-left { 
        flex: 0 1 auto;
        min-width: 0;
      }
      .header-center { 
        flex: 1;
        display: flex;
        justify-content: center;
        min-width: 0;
      }
      .header-right { 
        flex: 0 0 auto;
      }

      .name {
        font-size: 18px;
        font-weight: bold;
        white-space: nowrap;
      }

      .efficiency {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .efficiency ha-icon {
        --mdc-icon-size: 20px;
        color: var(--vmc-primary);
      }

      .card-content {
        display: grid;
        grid-template-columns: minmax(50px, 1fr) minmax(50px, 70px) minmax(50px, 1fr);
        grid-template-rows: 1fr 1fr;
        gap: 2px 4px;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        flex: 1;
        min-height: 0;
      }

      .temp-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .temp-label {
        font-size: 14px;
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-align: center;
      }

      .temp-value {
        font-size: 14px;
        font-weight: 500;
      }

      .left-top { grid-area: 1 / 1; }
      .left-bottom { grid-area: 2 / 1; }
      .right-top { grid-area: 1 / 3; }
      .right-bottom { grid-area: 2 / 3; }

      .exchanger {
        grid-area: 1 / 2 / 3 / 3;
        width: 100%;
        max-width: 80px;
        aspect-ratio: 1;
        justify-self: center;
        overflow: hidden;
        z-index: 1;
      }

      .exchanger svg {
        width: 100%;
        height: 100%;
      }

      .side-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        align-self: stretch;
        padding: 4px 6px;
        position: relative;
        z-index: 5;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        font-size: 14px;
        text-align: center;
      }

      .info-item ha-icon {
        --mdc-icon-size: 24px;
        color: var(--secondary-text-color);
      }

      .info-item.humidity ha-icon { color: var(--info-color, #039be5); }
      .info-item.fan ha-icon { color: var(--primary-text-color); }

      .spinning {
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        100% { transform: rotate(360deg); }
      }

      /* Controls wrapper - unified container for drawer + controls */
      .controls-wrapper {
        /* Glass effect using color-mix for compatibility */
        background: color-mix(in srgb, var(--card-background-color, #202020) 80%, transparent);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
        border-radius: 24px;
        display: flex;
        flex-direction: row;
        /* Height matches container naturally or set 100% of parent relative height */
        position: absolute;
        top: 12px;
        bottom: 12px;
        right: 6px;
        width: auto;
        z-index: 20;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Drawer panel - hidden by default */
      .drawer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 0;
      }

      .controls-wrapper.drawer-open .drawer {
        width: 48px;
        padding: 8px 6px;
        opacity: 1;
      }

      .drawer-btn {
        background: none;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 50%;
        color: var(--secondary-text-color);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .drawer-btn:hover {
        background: rgba(var(--rgb-primary-text-color), 0.1);
      }

      .drawer-btn ha-icon {
        --mdc-icon-size: 24px;
      }

      .drawer-btn.active {
        color: var(--success-color, #4caf50);
      }

      .drawer-btn.active.boost {
        color: var(--warning-color, #ff9800);
      }

      .controls {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        gap: 4px;
        padding: 8px 6px;
        box-sizing: border-box;
        height: 100%;
      }

      .control-btn {
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        border-radius: 50%;
        color: var(--primary-text-color);
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .control-btn:hover {
        background: rgba(var(--rgb-primary-text-color), 0.1);
      }

      .control-btn ha-icon {
        --mdc-icon-size: 24px;
      }

      /* Footer with bypass and filters */
      .card-footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        gap: 6px 12px;
        padding: 6px 0 0 0;
        margin-top: 2px;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        width: 100%;
      }

      .footer-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        opacity: 0.9;
      }

      .footer-item ha-icon {
        --mdc-icon-size: 18px;
      }

      .footer-item.bypass ha-icon { color: var(--vmc-info); }
      .footer-item.bypass.open ha-icon { color: var(--warning-color, #ff9800); }
      .footer-item.bypass.closed ha-icon { color: var(--success-color, #4caf50); }
      .footer-item.filter ha-icon { color: var(--success-color, #4caf50); }
      .footer-item.filter.warning ha-icon { color: var(--error-color, #f44336); }

      /* Compact mode - when card is small */
      @media (max-width: 400px) {
        .card-content {
          grid-template-columns: 1fr minmax(40px, 50px) 1fr auto;
        }
        
        .side-info {
          padding: 0 4px 0 8px;
        }
        
        .exchanger { max-width: 50px; }
        .temp-label { font-size: 10px; }
        .temp-value { font-size: 11px; }
        
        .name { font-size: 14px; }
        .efficiency { font-size: 11px; }
        .info-item { font-size: 11px; }
      }

      /* Very compact vertical mode */
      @container (max-height: 200px) {
        .main-section { padding: 4px 6px 4px 8px !important; }
        .controls-section { padding: 4px 8px 4px 6px !important; }
        .card-header { margin-bottom: 2px !important; }
        .card-footer { display: none; }
        .exchanger { max-width: 60px; }
      }

      @media (max-width: 300px) {
        .side-info { display: none; }
        .card-content {
          grid-template-columns: 1fr minmax(40px, 50px) 1fr;
        }
      }
    `}getCardSize(){return 4}static getGridOptions(){return{columns:12,min_columns:6,rows:3,min_rows:2,max_rows:4}}}),customElements.define("maico-vmc-card-editor",class extends e{static get properties(){return{hass:{type:Object},config:{type:Object}}}setConfig(e){this.config=e}render(){return this.hass&&this.config?t`
      <div class="editor">
        <ha-textfield
          label="Nom de la carte"
          .value="${this.config.name||"VMC"}"
          @input="${this._nameChanged}"
        ></ha-textfield>

        <ha-formfield label="Afficher le rendement">
          <ha-switch
            .checked="${!1!==this.config.show_efficiency}"
            @change="${this._efficiencyChanged}"
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Afficher le graphique d'humidité">
          <ha-switch
            .checked="${!1!==this.config.show_graph}"
            @change="${this._graphChanged}"
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Afficher l'humidité">
          <ha-switch
            .checked="${!1!==this.config.show_humidity}"
            @change="${this._humidityChanged}"
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Afficher le mode ventilateur">
          <ha-switch
            .checked="${!1!==this.config.show_fan_mode}"
            @change="${this._fanModeChanged}"
          ></ha-switch>
        </ha-formfield>
      </div>
    `:t``}_nameChanged(e){this._updateConfig("name",e.target.value)}_efficiencyChanged(e){this._updateConfig("show_efficiency",e.target.checked)}_graphChanged(e){this._updateConfig("show_graph",e.target.checked)}_humidityChanged(e){this._updateConfig("show_humidity",e.target.checked)}_fanModeChanged(e){this._updateConfig("show_fan_mode",e.target.checked)}_updateConfig(e,t){const i={...this.config,[e]:t},o=new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0});this.dispatchEvent(o)}static get styles(){return i`
      .editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      ha-textfield {
        width: 100%;
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"maico-vmc-card",name:"Maico VMC Card",description:"Carte personnalisée pour VMC Maico WS avec auto-découverte",preview:!0,documentationURL:"https://github.com/isaya07/ha-maicows-card"}),console.info("%c MAICO-VMC-CARD %c 1.2.0","color: white; background: #039be5; font-weight: bold;","color: #039be5; background: white; font-weight: bold;");
