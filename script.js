'use strict';

const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
function closeMenu() {
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  mainNav.classList.toggle('is-open', open);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuToggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Both tab groups support pointer, arrow keys, Home, and End.
function setupTabs(group, select) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); select(tabs[next]); tabs[next].focus();
    });
  });
  return tabs;
}
function markSelected(tabs, selected) {
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}
const stages = [
  { kicker:'THE STARTING POINT', title:'Give every detail\na place to belong.', description:'Open a case and work through structured fields for the client, fiduciaries, beneficiaries, and planning choices.', label:'CASE DETAILS', heading:'Morgan Family Estate', rows:[['Client','Alex Morgan'],['County','Travis'],['Planning choices','Ready to enter']], status:'A clear starting point', next:'Build your package', nextLabel:'UP NEXT', icon:'↗' },
  { kicker:'THE RIGHT DOCUMENTS', title:'Shape the package\naround the plan.', description:'Choose the documents and provisions for this case, then complete their guided sections. Basic entry checks help surface details still to enter.', label:'SELECTED DOCUMENTS', heading:'A package with purpose.', rows:[['Last Will & Testament','Included'],['Medical Power of Attorney','Included'],['HIPAA Authorization','Included']], status:'Your selections, kept together', next:'Review your entries', nextLabel:'UP NEXT', icon:'✓' },
  { kicker:'THE WORK, ASSEMBLED', title:'Bring it together.\nMake room for review.', description:'Generate individual Word documents into an organized package folder. Open the files and apply your firm’s professional review process.', label:'WORD DOCUMENTS', heading:'Prepared for your review.', rows:[['Last Will & Testament','.docx'],['Medical Power of Attorney','.docx'],['HIPAA Authorization','.docx']], status:'Organized in your Downloads folder', next:'Review each document', nextLabel:'YOUR NEXT STEP', icon:'▤' },
  { kicker:'WHAT COMES NEXT', title:'Keep the next step\nwithin reach.', description:'Prepare a client email draft, track a follow-up task, or plan a meeting. You choose when to send, schedule, and mark work complete.', label:'CLIENT FOLLOW-UP', heading:'The details keep moving.', rows:[['Client email','Draft for review'],['Signing follow-up','Task to schedule'],['Client meeting','Calendar event']], status:'The work around the package', next:'Move the plan forward', nextLabel:'WITH YOU IN CONTROL', icon:'↗' }
];
const flowPanel = document.getElementById('flow-panel');
const flowButton = document.getElementById('play-flow');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeStage = 0;
let flowTimer = null;
function setText(id, value) { document.getElementById(id).textContent = value; }
function renderStage(index) {
  activeStage = index;
  const stage = stages[index];
  markSelected(flowTabs, flowTabs[index]);
  flowPanel.setAttribute('aria-labelledby', flowTabs[index].id);
  flowPanel.dataset.stage = String(index);
  setText('flow-kicker',stage.kicker);
  const title = document.getElementById('flow-title');
  title.replaceChildren(...stage.title.split('\n').flatMap((line,i) => i ? [document.createElement('br'),document.createTextNode(line)] : [document.createTextNode(line)]));
  setText('flow-description',stage.description);setText('art-label',stage.label);setText('art-title',stage.heading);setText('art-status',stage.status);setText('art-destination',stage.next);setText('art-destination-label',stage.nextLabel);setText('art-destination-icon',stage.icon);setText('flow-counter',`0${index+1} — 04`);
  document.getElementById('art-rows').replaceChildren(...stage.rows.map(([label,value]) => {
    const row = document.createElement('div');row.className='paper-row';
    const name=document.createElement('span');name.textContent=label;
    const content=document.createElement('b');content.textContent=value;
    row.append(name,content);return row;
  }));
  if (!motionPreference.matches && !document.documentElement.classList.contains('motion-paused')) {
    flowPanel.querySelector('.flow-paper').animate(
      [{opacity:0.35,transform:'translateY(10px) rotate(-1deg)'},{opacity:1,transform:'translateY(0) rotate(-1deg)'}],
      {duration:420,easing:'ease-out'}
    );
    flowPanel.querySelectorAll('.paper-row').forEach((row,i) => row.animate(
      [{opacity:0,transform:'translateX(-6px)'},{opacity:1,transform:'translateX(0)'}],
      {duration:300,delay:i*75,fill:'backwards',easing:'ease-out'}
    ));
  }
}
function stopFlow() {
  clearInterval(flowTimer); flowTimer=null;
  flowPanel.classList.remove('is-playing');
  flowButton.setAttribute('aria-pressed','false');
  flowButton.innerHTML='<span aria-hidden="true">▷</span> Play walkthrough';
}
const flowTabs = setupTabs(document.querySelector('.flow-tabs'), tab => { stopFlow(); renderStage(Number(tab.dataset.step)); });
flowButton.addEventListener('click', () => {
  if (flowTimer) { stopFlow(); return; }
  flowButton.setAttribute('aria-pressed','true');
  flowButton.innerHTML='<span aria-hidden="true">Ⅱ</span> Pause walkthrough';
  flowPanel.classList.add('is-playing');
  flowTimer=setInterval(() => renderStage((activeStage+1)%stages.length),6500);
});
// Timed playback is opt-in; leaving the walkthrough or browser tab stops it.
flowPanel.addEventListener('focusin',stopFlow);
document.addEventListener('visibilitychange',() => { if(document.hidden) stopFlow(); });
motionPreference.addEventListener('change',event => { if(event.matches) stopFlow(); });
if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if(!entries[0].isIntersecting) stopFlow(); },{threshold:0.1}).observe(document.querySelector('.workflow-console'));

const screens = {
  overview:{label:'Overview',title:'Pick up exactly where you left off.',description:'See your cases, upcoming tasks, and recorded activity, then move straight into the next piece of work.',alt:'InTrust overview with case activity, package totals, and a continue-case action.'},
  package:{label:'Document packages',title:'Every package starts with a clear plan.',description:'Choose documents, work through their sections, and see which basic details still need attention before generation and review.',alt:'A case workspace showing client details, selected documents, and basic entry checks.'},
  clients:{label:'Clients',title:'The people behind the plans, in one place.',description:'Keep contact details, useful notes, and linked cases together. Contact profiles stay separate from document fields.',alt:'A client directory with a fictional Alex Morgan profile and a linked estate case.'},
  calendar:{label:'Calendar',title:'Make room for the next conversation.',description:'Filter Court, Client Meeting, Consult, Travel, and Staff Meeting events. Open Google or Outlook drafts, or export an Apple-compatible calendar file.',alt:'The InTrust calendar with event-category filters and a monthly calendar.'},
  fees:{label:'Case fees',title:'Know what you expect from each case.',description:'Record service charges, adjustments, scope notes, and estimated or agreed fees. A clearer planning view, without payment processing.',alt:'Case fees showing service charges, a discount, scope notes, and the expected fee.'}
};
const workspaceImage=document.getElementById('workspace-image');
const enlargeButton=document.getElementById('enlarge-screen');
const screenTabs=setupTabs(document.querySelector('.workspace-tabs'),tab => {
  const key=tab.dataset.screen;const screen=screens[key];
  markSelected(screenTabs,tab);
  document.getElementById('workspace-panel').setAttribute('aria-labelledby',tab.id);
  workspaceImage.src=`assets/images/current/${key}-dark.png`;workspaceImage.alt=`${screen.alt} Dark mode.`;
  setText('screen-label',`InTrust / ${screen.label}`);setText('screen-title',screen.title);setText('screen-description',screen.description);
  enlargeButton.setAttribute('aria-label',`Enlarge ${screen.label.toLowerCase()} screenshot`);
});
const imageDialog=document.getElementById('image-dialog');
enlargeButton.addEventListener('click',() => {
  const image=document.getElementById('dialog-image');image.src=workspaceImage.src;image.alt=workspaceImage.alt;
  setText('image-dialog-title',document.getElementById('screen-label').textContent);
  imageDialog.showModal();document.body.classList.add('dialog-open');
});
document.querySelector('.close-image').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');enlargeButton.focus({preventScroll:true});});
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog){const r=imageDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)imageDialog.close();}});

const manualInput=document.getElementById('manual-time');
const appInput=document.getElementById('app-time');
const packageInput=document.getElementById('package-count');
function updateEstimate() {
  const inputs=[manualInput,appInput,packageInput];
  if(inputs.some(input=>input.value===''||!input.validity.valid)){
    setText('time-result','—');setText('time-result-label','Enter valid whole numbers to compare.');return;
  }
  const [manual,app,count]=inputs.map(input=>Number(input.value));
  const difference=(manual-app)*count;
  const absHours=Math.abs(difference)/60;
  const amount=new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(absHours);
  const result=document.getElementById('time-result');
  const unit=document.createElement('span');unit.textContent=absHours===1?'hour':'hours';
  result.replaceChildren(document.createTextNode(`${amount} `),unit);
  setText('time-result-label',difference>0?'of potential time back each month':difference<0?'of additional time each month with these inputs':'of difference each month with these inputs');
  const max=Math.max(manual,app,1);
  document.getElementById('manual-bar').style.width=`calc((100% - 60px) * ${manual/max})`;
  document.getElementById('app-bar').style.width=`calc((100% - 60px) * ${app/max})`;
}
[manualInput,appInput,packageInput].forEach(input=>input.addEventListener('input',updateEstimate));
updateEstimate();

const contactForm=document.getElementById('contact-form');
const formStatus=document.getElementById('form-status');
const isLocalPreview=['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname)||location.protocol==='file:';
if(isLocalPreview)formStatus.textContent='Local preview: requests are not sent. The existing form destination is preserved for publication.';
let sending=false;
contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!contactForm.reportValidity()||sending)return;
  if(isLocalPreview){formStatus.textContent='Preview only — your request was not sent. The form is ready for the published site.';return;}
  sending=true;
  const button=contactForm.querySelector('button[type="submit"]');button.disabled=true;button.setAttribute('aria-busy','true');
  formStatus.textContent='Sending your request…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch(contactForm.action,{method:'POST',body:new FormData(contactForm),headers:{Accept:'application/json'},signal:controller.signal});
    if(!response.ok)throw new Error('Request failed');
    contactForm.reset();formStatus.textContent='Thank you. Your request has been sent. We’ll be in touch to arrange your walkthrough.';
  }catch{
    formStatus.textContent='We couldn’t confirm delivery. Your details are still here. Please try again or email isaacdavidnino@gmail.com.';
  }finally{
    clearTimeout(timeout);sending=false;button.disabled=false;button.removeAttribute('aria-busy');
  }
});
setText('year',String(new Date().getFullYear()));

const heroImage=document.getElementById('hero-image');
const lightPreview=document.getElementById('preview-light');
const darkPreview=document.getElementById('preview-dark');
function previewAppearance(dark){
  heroImage.src=`assets/images/current/overview${dark?'-dark':''}.png`;
  heroImage.alt=`The redesigned InTrust overview in ${dark?'dark':'light'} mode, with fictional case activity and a continue-case action.`;
  lightPreview.setAttribute('aria-pressed',String(!dark));
  darkPreview.setAttribute('aria-pressed',String(dark));
}
lightPreview.addEventListener('click',()=>previewAppearance(false));
darkPreview.addEventListener('click',()=>previewAppearance(true));

// Scroll-linked storytelling. Event-driven frames keep idle pages idle.
const motionRoot = document.documentElement;
const motionToggle = document.getElementById('motion-toggle');
const motionLabel = document.getElementById('motion-label');
const desktopStory = window.matchMedia('(min-width: 900px) and (min-height: 700px)');
const heroSection = document.querySelector('.hero');
const workflowScroll = document.querySelector('.workflow-scroll');
const workflowPin = document.querySelector('.workflow-pin');
const galleryWindow = document.querySelector('.gallery-window');
const bridgeSection = document.querySelector('.flow-bridge');
const bridgeWords = [...bridgeSection.querySelectorAll('p > span')];
const calculator = document.querySelector('.time-calculator');
let motionEnabled = !motionPreference.matches;
let framePending = false;
let lastScrollStage = -1;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const revealElements = [...document.querySelectorAll('.section-heading > *, .centered, .intro-strip .container > *, .detail-grid article, .time-copy > *, .time-calculator, .firm-layout > div:first-child > *, .firm-details article, .faq-layout > div:first-child, .faqs details, .contact-copy > *, #contact-form, .footer-main > *')];
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-revealed');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: 0.12 }) : null;
if (revealObserver) {
  revealElements.forEach(element => {
    element.classList.add('reveal-item');
    const siblings = [...element.parentElement.children];
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 90}ms`);
    revealObserver.observe(element);
  });
}

function updateScrollScene() {
  framePending = false;
  if (!motionEnabled) return;
  const height = window.innerHeight;
  const scrollY = window.scrollY;
  const heroProgress = clamp(scrollY / (heroSection.offsetHeight * 0.65));
  motionRoot.style.setProperty('--reading-progress', clamp(scrollY / Math.max(1, motionRoot.scrollHeight - height)));
  motionRoot.style.setProperty('--hero-copy-y', `${heroProgress * 60}px`);
  motionRoot.style.setProperty('--hero-copy-opacity', 1 - heroProgress * 0.4);
  motionRoot.style.setProperty('--hero-lift', `${(1 - heroProgress) * 22}px`);
  motionRoot.style.setProperty('--hero-tilt', `${(1 - heroProgress) * 7}deg`);
  motionRoot.style.setProperty('--hero-scale', 0.94 + heroProgress * 0.06);
  motionRoot.style.setProperty('--note-drift', `${-heroProgress * 34}px`);
  motionRoot.style.setProperty('--route-offset', 1300 * (1 - heroProgress));

  if (desktopStory.matches) {
    const rect = workflowScroll.getBoundingClientRect();
    const distance = Math.max(1, rect.height - workflowPin.offsetHeight);
    const progress = clamp((103 - rect.top) / distance);
    workflowScroll.style.setProperty('--workflow-progress', progress);
    const step = Math.min(3, Math.floor(progress * 4));
    // Manual selection stays put until the scroll crosses another stage boundary.
    if (rect.top <= height * 0.55 && rect.bottom >= 103 && step !== lastScrollStage) {
      lastScrollStage = step;
      if (!flowTimer && !flowPanel.contains(document.activeElement) && activeStage !== step) renderStage(step);
    }
  }

  const galleryRect = galleryWindow.getBoundingClientRect();
  const galleryProgress = clamp((height - galleryRect.top) / (height * 0.85));
  galleryWindow.style.setProperty('--gallery-tilt', `${(1 - galleryProgress) * 5}deg`);
  galleryWindow.style.setProperty('--gallery-scale', 0.92 + galleryProgress * 0.08);
  const bridgeRect = bridgeSection.getBoundingClientRect();
  const bridgeProgress = clamp((height * 0.9 - bridgeRect.top) / (height * 0.65 + bridgeRect.height * 0.35));
  bridgeSection.style.setProperty('--bridge-progress', bridgeProgress);
  bridgeWords.forEach((word, index) => {
    const wordProgress = clamp(bridgeProgress * 2.4 - index * 0.55);
    word.style.setProperty('--word-opacity', 0.3 + wordProgress * 0.7);
    word.style.setProperty('--word-x', `${(1 - wordProgress) * (index % 2 ? 50 : -50)}px`);
  });
  const calcRect = calculator.getBoundingClientRect();
  calculator.style.setProperty('--bars-progress', clamp((height * 0.95 - calcRect.top) / (height * 0.55)));
}
function scheduleScrollScene() {
  if (!motionEnabled || framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateScrollScene);
}
function applyMotionPreference(enabled) {
  motionEnabled = enabled && !motionPreference.matches && !!revealObserver;
  motionRoot.classList.toggle('motion-enabled', motionEnabled);
  motionRoot.classList.toggle('motion-paused', !motionEnabled);
  motionToggle.hidden = false;
  motionToggle.disabled = motionPreference.matches;
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionLabel.textContent = motionPreference.matches ? 'Reduced motion' : motionEnabled ? 'Motion on' : 'Motion off';
  if (!motionEnabled) {
    stopFlow();
    // Cancel JS-created effects as well as CSS animations immediately.
    document.getAnimations().forEach(animation => animation.cancel());
  }
  lastScrollStage = -1;
  scheduleScrollScene();
}
motionToggle.addEventListener('click', () => applyMotionPreference(!motionEnabled));
motionPreference.addEventListener('change', () => applyMotionPreference(!motionPreference.matches));
desktopStory.addEventListener('change', () => { lastScrollStage = -1; scheduleScrollScene(); });
window.addEventListener('scroll', scheduleScrollScene, { passive: true });
window.addEventListener('resize', scheduleScrollScene, { passive: true });
window.addEventListener('load', scheduleScrollScene, { once: true });
applyMotionPreference(motionEnabled);
