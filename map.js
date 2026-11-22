(function(){
  var el=document.getElementById('leaflet'); if(!el||!window.L) return;

  /* Public businesses use the listed place. Private homes are town centroids only — never a house. */
  var C={
    mon:'#38bdf8', tue:'#a78bfa', wed:'#fbbf24',
    thu:'#f472b6', fri:'#34d399', sat:'#fb923c'
  };
  var P={
    den:{ll:[39.86067,-104.68537], n:1, color:C.mon, name:'DEN airport', days:'Mon arrival, Sat departure'},
    northglenn:{ll:[39.91009,-104.98755], n:2, color:C.mon, name:'Northglenn (Sandy)', days:'Mon–Tue nights at Sandy’s · Wed park her car · town center, not a home address'},
    union:{ll:[39.75363,-105.00075], n:3, color:C.tue, name:'Union Station', days:'Tue · Sandy’s 8:46 AM Zephyr via the N Line'},
    parker:{ll:[39.51914,-104.76960], n:4, color:C.tue, name:'Parker · Bread & Butters', days:'Tue breakfast ~9:00, flexible with traffic · 18901 Mainstreet'},
    welby:{ll:[39.83271,-104.97442], n:5, color:C.wed, name:'Welby · Gem Industries', days:'Wed 9:30–11:30 AM · John’s shop, then breakfast'},
    westminster:{ll:[39.83665,-105.03720], n:6, color:C.thu, name:'Westminster (parents)', days:'Thu Thanksgiving 9:00 AM–5:00 PM · town center, not a home address'},
    hr:{ll:[39.53857,-104.97259], n:7, color:C.tue, name:'Highlands Ranch (Preston)', days:'Tue, Wed, Sat · town center, not a home address'},
    longmont:{ll:[40.13988,-105.13259], n:8, color:C.wed, name:'Longmont Residence Inn', days:'Wed–Fri nights, Sat checkout'},
    chautauqua:{ll:[39.99740,-105.28097], n:9, color:C.fri, name:'Chautauqua', days:'Fri 9:00 AM–5:00 PM · Pearl Street / Flatirons walk'},
    rio:{ll:[40.01682,-105.28081], n:10, color:C.fri, name:'Rio Grande Mexican Restaurant', days:'Fri 6:00 PM reserved · 1101 Walnut St, Boulder'}
  };

  var map=L.map(el,{scrollWheelZoom:false,zoomSnap:0.25,zoomControl:true});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:18,
    attribution:'© OpenStreetMap contributors'
  }).addTo(map);

  function line(keys, color, dash){
    var latlngs=keys.map(function(k){return P[k].ll;});
    L.polyline(latlngs,{color:color,weight:4,opacity:.88,dashArray:dash||null}).addTo(map);
  }
  line(['den','northglenn'], C.mon);
  line(['northglenn','parker','hr'], C.tue);
  line(['welby','northglenn','hr','longmont'], C.wed);
  line(['longmont','westminster'], C.thu);
  line(['longmont','chautauqua'], C.fri, '7 7');
  line(['longmont','rio'], C.fri);
  line(['longmont','den','hr'], C.sat);

  Object.keys(P).forEach(function(k){
    var p=P[k];
    var icon=L.divIcon({
      className:'pin',
      html:'<span class="pin-dot" style="background:'+p.color+'">'+p.n+'</span>',
      iconSize:[26,26],
      iconAnchor:[13,13],
      popupAnchor:[0,-14]
    });
    L.marker(p.ll,{icon:icon,keyboard:true,title:p.name})
      .addTo(map)
      .bindPopup('<b>'+p.n+'. '+p.name+'</b><br>'+p.days);
  });

  var south=['den','northglenn','union','parker','welby','westminster','hr'];
  var north=['westminster','longmont','chautauqua','rio'];
  function bounds(keys){return keys.map(function(k){return P[k].ll;});}
  function all(){map.fitBounds(bounds(Object.keys(P)),{padding:[28,28],maxZoom:10});}
  function zoomSouth(){map.fitBounds(bounds(south),{padding:[28,28],maxZoom:11});}
  function zoomNorth(){map.fitBounds(bounds(north),{padding:[36,36],maxZoom:11});}

  function bind(id, fn){
    var b=document.getElementById(id); if(!b) return;
    b.addEventListener('click',function(){
      document.querySelectorAll('.map-toggle button').forEach(function(x){
        x.setAttribute('aria-pressed', x===b?'true':'false');
      });
      fn();
      map.invalidateSize();
    });
  }
  bind('zoom-all', all);
  bind('zoom-south', zoomSouth);
  bind('zoom-north', zoomNorth);
  all();
  setTimeout(function(){map.invalidateSize();}, 200);
  window.addEventListener('resize', function(){map.invalidateSize();});
})();
