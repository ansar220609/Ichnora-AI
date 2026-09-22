const assert=require('node:assert/strict');
const C=require('../core.js');
const policy={sensitivity:60,fpCost:10000,challengeCost:150,effectiveness:50};
const model=C.train(),data=C.scoreData(C.generate(100000),model),bins=C.summarize(data);
assert.equal(data.length,100000);assert.equal(C.codes.length,249);assert.equal(new Set(C.codes).size,249);
assert(data.every(t=>Number.isFinite(t.score)&&t.score>=0&&t.score<=100));
const low=C.metrics(bins,{...policy,sensitivity:0}),high=C.metrics(bins,{...policy,sensitivity:100});
assert(high.block>low.block);assert(high.fp>low.fp);assert(high.exposure<low.exposure);
assert.equal(low.f1,0);
for(const sensitivity of [0,11,60,99,100]){
  const p={...policy,sensitivity},m=C.metrics(bins,p),counts={Approve:0,Challenge:0,Block:0};
  for(const tx of data)counts[C.action(tx.score,p)]++;
  assert.equal(counts.Approve,m.approve);assert.equal(counts.Challenge,m.challenge);assert.equal(counts.Block,m.block);
  assert.equal(m.tp+m.fp+m.tn+m.fn,100000);assert.equal(m.approve+m.challenge+m.block,100000);
}
const q=C.curves(bins);assert(q.roc>.5&&q.roc<=1);assert(q.ap>0&&q.ap<=1);
const tx={...data[0],label:null};const unknown=C.metrics(C.summarize([tx]),policy);assert.equal(unknown.known,0);assert.equal(unknown.fpr,null);assert.equal(unknown.recall,null);
const sample=data.slice(0,8);const csv=C.exportCSV(sample,policy),back=C.parseCSV(csv);assert.equal(back.length,8);assert.deepEqual(C.features(back[0]),C.features(sample[0]));
assert.throws(()=>C.parseCSV('id,amount\na,12'),/Отсутствует/);
assert.throws(()=>C.parseCSV(csv.replace('"'+sample[1].id+'"','"'+sample[0].id+'"')),/повторяющийся/);
assert.throws(()=>C.parseCSV('id,amount\n"unclosed'),/кавычка/);
assert.throws(()=>C.parseCSV(C.exportCSV([{...sample[0],timestamp:'2026-02-31T12:00:00Z'}],policy)),/даты/);
const nonFinite=C.exportCSV([{...sample[0],amount:Infinity}],policy);assert.throws(()=>C.parseCSV(nonFinite),/Недопустимая/);
const weird={...sample[0],merchant:'Store, "quotes"\nand newline'};assert.equal(C.parseCSV(C.exportCSV([weird],policy))[0].merchant,weird.merchant);
assert(C.exportCSV([{...sample[0],merchant:'=WEBSERVICE("evil")'}],policy).includes("'=WEBSERVICE"));
for(const t of sample){const p=C.predict(t,model);assert(Math.abs(p.logit-(model.intercept+p.factors.reduce((s,f)=>s+f.contribution,0)))<1e-10);}
const world=require('node:fs').readFileSync(require('node:path').join(__dirname,'../world.js'),'utf8');assert(world.includes('globalThis.WORLD_MAP'));assert(world.length>100000);
console.log('PASS: 100k scoring, 249 countries, thresholds, confusion matrix, curves, CSV validation, export safety, model explanations.');
console.log(JSON.stringify({rocAuc:q.roc,averagePrecision:q.ap,default:C.metrics(bins,policy)},null,2));
