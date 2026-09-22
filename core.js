(function (root) {
  'use strict';
  const codes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
  const featureNames = ['Отклонение суммы', 'Частота операций', 'Новое устройство', 'Смена страны', 'VPN / Proxy', 'Новый получатель', 'Ночное время', 'Комбинация устройства и VPN'];
  function random(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
  function features(t) {
    return [Math.min(4, Math.log2(1 + t.amount / t.average)) / 2, Math.min(20, t.frequency) / 5, +t.newDevice, +(t.country !== t.home), +t.vpn, +t.newMerchant, +(new Date(t.timestamp).getUTCHours() < 5), +(t.newDevice && t.vpn)];
  }
  function generate(count, seed = 42, prefix = 'TX', start = Date.UTC(2026, 8, 1)) {
    const rng = random(seed), pick = a => a[Math.floor(rng() * a.length)];
    const popular = ['KZ','KZ','KZ','KZ','US','GB','TR','AE','DE','BR','NG','IN','JP','CN','UA','UZ','KG','FR','CA','AU'];
    return Array.from({length:count}, (_, i) => {
      const home = rng() < .76 ? 'KZ' : pick(popular), changed = rng() < .13;
      const country = changed ? (rng() < .5 ? pick(codes) : pick(popular)) : home;
      const average = Math.round(3000 + rng() * 47000), amount = Math.round(average * (rng() < .09 ? 5 + rng() * 40 : .15 + rng() * 3));
      const user = 'U-' + (1000 + Math.floor(rng() * 4500));
      const t = {id:prefix + '-' + String(i + 1).padStart(6,'0'), user, amount, average, country, home, timestamp:new Date(start + Math.floor(i / count * 30 * 86400000)).toISOString(), newDevice:rng()<.15, vpn:rng()<.10, newMerchant:rng()<.18, frequency:rng()<.12 ? 5+Math.floor(rng()*15) : 1+Math.floor(rng()*4), merchant:pick(['Market','Travel','Transfer','Digital','Service'])+'-'+(1+Math.floor(rng()*90)), ip:rng()<.035 ? '198.51.100.77' : '192.0.2.'+(1+Math.floor(rng()*240)), device:'Device-'+user, label:null};
      if(t.newDevice) t.device = 'Shared-device-'+(1+Math.floor(rng()*35));
      // Latent synthetic process: labels are generated before, independently of the fitted model.
      const x = features(t);
      const p = sigmoid(-6 + x[0]*1.45 + x[1]*.45 + x[2]*1.3 + x[3]*.45 + x[4]*.6 + x[5]*.5 + x[6]*.2 + x[7]*1.2);
      t.label = +(rng()<p);
      return t;
    });
  }
  function train() {
    const data = generate(12000, 901, 'TRAIN', Date.UTC(2026,6,1));
    const xs = data.map(features), weights = Array(8).fill(0); let intercept = -3;
    for(let epoch=0;epoch<1800;epoch++) {
      const gradients = Array(8).fill(0); let bias=0;
      for(let i=0;i<data.length;i++) {
        const x=xs[i]; let z=intercept;
        for(let j=0;j<8;j++)z+=weights[j]*x[j];
        const err=sigmoid(z)-data[i].label; bias+=err;
        for(let j=0;j<8;j++)gradients[j]+=err*x[j];
      }
      intercept-=.8*bias/data.length;
      for(let j=0;j<8;j++)weights[j]-=.8*(gradients[j]/data.length+.0001*weights[j]);
    }
    return {weights,intercept,type:'Logistic regression',trainingRows:data.length};
  }
  function predict(t,model) {
    const x=features(t), factors=x.map((v,i)=>({name:featureNames[i],value:v,contribution:v*model.weights[i]}));
    const logit=model.intercept+factors.reduce((a,b)=>a+b.contribution,0);
    return {score:Math.round(sigmoid(logit)*1000)/10,logit,factors};
  }
  function scoreData(data,model) { for(const t of data)t.score=predict(t,model).score; return data; }
  function thresholds(sensitivity) { const block=Math.round((95-Number(sensitivity)*.9)*10)/10; return {block,challenge:Math.round(block*.55*10)/10}; }
  function action(score,policy) { const t=thresholds(policy.sensitivity); return score>=t.block?'Block':score>=t.challenge?'Challenge':'Approve'; }
  function summarize(data) {
    const bins=Array.from({length:1001},()=>({count:0,known:0,fraud:0,legit:0,fraudAmount:0}));
    for(const t of data){const b=bins[Math.min(1000,Math.round(t.score*10))];b.count++;if(t.label===0||t.label===1){b.known++;b.fraud+=t.label;b.legit+=1-t.label;if(t.label)b.fraudAmount+=t.amount;}}
    return bins;
  }
  function metrics(bins,policy) {
    const m={total:0,known:0,approve:0,challenge:0,block:0,tp:0,fp:0,tn:0,fn:0,saved:0,exposure:0,friction:0,challengeCost:0,prevented:0};
    bins.forEach((b,i)=>{ const a=action(i/10,policy);m.total+=b.count;m.known+=b.known;m[a.toLowerCase()]+=b.count;
      if(a==='Block'){m.tp+=b.fraud;m.fp+=b.legit;m.saved+=b.fraudAmount;m.friction+=b.legit*policy.fpCost;}
      else {m.fn+=b.fraud;m.tn+=b.legit;m.exposure+=b.fraudAmount*(a==='Challenge'?1-policy.effectiveness/100:1);if(a==='Challenge')m.prevented+=b.fraudAmount*policy.effectiveness/100;}
      if(a==='Challenge')m.challengeCost+=b.count*policy.challengeCost;
    });
    m.precision=m.tp+m.fp?m.tp/(m.tp+m.fp):null;m.recall=m.tp+m.fn?m.tp/(m.tp+m.fn):null;m.fpr=m.fp+m.tn?m.fp/(m.fp+m.tn):null;m.f1=2*m.tp+m.fp+m.fn?2*m.tp/(2*m.tp+m.fp+m.fn):null;
    m.totalCost=m.exposure+m.friction+m.challengeCost; return m;
  }
  function curves(bins) {
    const positives=bins.reduce((s,b)=>s+b.fraud,0), negatives=bins.reduce((s,b)=>s+b.legit,0);
    let tp=0,fp=0; const points=[{recall:0,precision:1,fpr:0,threshold:101}];
    for(let i=1000;i>=0;i--){const b=bins[i];tp+=b.fraud;fp+=b.legit;if(b.known)points.push({recall:positives?tp/positives:0,precision:tp+fp?tp/(tp+fp):1,fpr:negatives?fp/negatives:0,threshold:i/10});}
    let roc=0,ap=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];roc+=(b.fpr-a.fpr)*(a.recall+b.recall)/2;ap+=(b.recall-a.recall)*b.precision;}
    return {points,roc:positives&&negatives?roc:null,ap:positives?ap:null};
  }
  function parseCSV(text) {
    text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0]; const sep=first.split(';').length>first.split(',').length?';':',';
    let rows=[],row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(!quoted&&cell.length)throw Error('Некорректная кавычка в CSV.');else quoted=!quoted;}
      else if(c===sep&&!quoted){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}
      else cell+=c;
    }
    if(quoted)throw Error('Не закрыта кавычка в CSV.');if(cell||row.length){row.push(cell);rows.push(row);}
    if(rows.length<2)throw Error('В CSV нет транзакций.');const header=rows.shift().map(x=>x.trim().toLowerCase());
    if(new Set(header).size!==header.length)throw Error('Повторяющиеся названия столбцов.');
    for(const key of ['id','user','amount','average','country','home','timestamp','frequency','new_device','vpn','new_merchant'])if(!header.includes(key))throw Error('Отсутствует столбец: '+key);
    if(rows.length>100000)throw Error('Лимит — 100 000 строк за одну загрузку.');
    const seen=new Set(), bool=(v,name)=>{if(!['0','1','true','false'].includes(v?.toLowerCase()))throw Error(name+': ожидается 0/1 или true/false');return ['1','true'].includes(v.toLowerCase());};
    return rows.map((r,i)=>{try{if(r.length!==header.length)throw Error('Число столбцов не совпадает с заголовком');const v=Object.fromEntries(header.map((k,j)=>[k,r[j].trim()]));
      if(!v.id||seen.has(v.id))throw Error('Пустой или повторяющийся ID');seen.add(v.id);if(!v.user)throw Error('Не указан user');
      const amount=Number(v.amount),average=Number(v.average),frequency=Number(v.frequency);if(!v.amount||!v.average||!v.frequency||![amount,average,frequency].every(Number.isFinite)||amount<=0||average<=0||amount>1e12||!Number.isInteger(frequency)||frequency<0||frequency>10000)throw Error('Недопустимая сумма, средняя сумма или частота');
      const country=v.country.toUpperCase(),home=v.home.toUpperCase();if(!codes.includes(country)||!codes.includes(home))throw Error('Страна должна быть кодом ISO alpha-2, например KZ');
      if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v.timestamp)||!Number.isFinite(Date.parse(v.timestamp)))throw Error('Время должно быть ISO 8601 с часовым поясом');
      const [year,month,day]=v.timestamp.slice(0,10).split('-').map(Number);const checkDate=new Date(Date.UTC(year,month-1,day));if(checkDate.getUTCFullYear()!==year||checkDate.getUTCMonth()!==month-1||checkDate.getUTCDate()!==day)throw Error('Такой даты не существует');
      let label=null;if(v.label!==undefined&&v.label!==''){if(!['0','1'].includes(v.label))throw Error('label должен быть 0, 1 или пустым');label=Number(v.label);}
      return {id:v.id,user:v.user,amount,average,frequency,country,home,timestamp:new Date(v.timestamp).toISOString(),newDevice:bool(v.new_device,'new_device'),vpn:bool(v.vpn,'vpn'),newMerchant:bool(v.new_merchant,'new_merchant'),merchant:v.merchant||'Unknown',device:v.device||'Unknown',ip:v.ip||'Unknown',label};
    }catch(e){throw Error('Строка '+(i+2)+': '+e.message);}});
  }
  function csvCell(v){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function exportCSV(data,policy) {
    const keys=['id','user','amount','average','country','home','timestamp','frequency','new_device','vpn','new_merchant','merchant','device','ip','label','risk_score','action'];
    return '\uFEFF'+keys.join(',')+'\r\n'+data.map(t=>[t.id,t.user,t.amount,t.average,t.country,t.home,t.timestamp,t.frequency,+t.newDevice,+t.vpn,+t.newMerchant,t.merchant,t.device,t.ip,t.label,t.score?.toFixed(3)??'',policy?action(t.score,policy):''].map(csvCell).join(',')).join('\r\n');
  }
  const api={codes,features,featureNames,generate,train,predict,scoreData,thresholds,action,summarize,metrics,curves,parseCSV,exportCSV,sigmoid};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.FraudCore=api;
})(globalThis);
