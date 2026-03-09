import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser'; // used only if CONTACT_MODE == 'email'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';

const SOCIAL_LINKS = [
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/adish-padalia-a3768a230/', label: 'LinkedIn' },
  { icon: EmailIcon, href: `mailto:${process.env.REACT_APP_EMAIL || 'padaliaadish@gmail.com'}`, label: 'Email' },
  { icon: GitHubIcon, href: 'https://github.com/AdishPadalia26', label: 'GitHub' },
  { icon: SchoolIcon, href: 'https://scholar.google.com/citations?user=spsQ3XsAAAAJ&hl=en', label: 'Google Scholar' },
];

const ContactConsole = () => {
  const [phase, setPhase] = useState('idle'); // idle | intro | handshake | form | sent
  const [typed, setTyped] = useState(0);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ email: '' });
  const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });
  const [deliveredVisible, setDeliveredVisible] = useState(false); // success badge visibility

  // Auto-hide delivered badge after 5 seconds
  useEffect(() => {
    if (!deliveredVisible) return;
    const t = setTimeout(() => setDeliveredVisible(false), 5000);
    return () => clearTimeout(t);
  }, [deliveredVisible]);
  const intro = 'Establishing connection...';
  const intRef = useRef(null);

  // Intro typing effect starts only when phase becomes 'intro'
  useEffect(() => {
    if (phase !== 'intro') return;
    setTyped(0);
    intRef.current = setInterval(() => {
      setTyped(t => {
  if (t < intro.length) return t + 1;
  clearInterval(intRef.current);
  // brief handshake phase before form
  setPhase('handshake');
  setTimeout(() => setPhase('form'), 1200);
        return t;
      });
    }, 50);
    return () => clearInterval(intRef.current);
  }, [phase, intro]);

  // Intersection observer: when component enters view first time (idle), trigger intro
  const containerRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const wasInViewRef = useRef(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const now = Date.now();
        if (entry.isIntersecting) {
          // Debounce & preserve user progress: don't restart if user is composing or message sent
          const userHasStartedTyping = form.name || form.email || form.message;
          if (phase === 'form' && userHasStartedTyping) { wasInViewRef.current = true; return; }
          if (phase === 'sent' || sending) { wasInViewRef.current = true; return; }
          // Only restart if we were previously out of view and enough time elapsed
          if (!wasInViewRef.current && now - lastTriggerRef.current > 1500) {
            setTyped(0);
            setPhase('intro');
            lastTriggerRef.current = now;
          }
          wasInViewRef.current = true;
        } else {
          wasInViewRef.current = false; // mark that we've left viewport
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, form, sending]);

  // Global event listener to force restart when user clicks Contact links
  useEffect(() => {
    const handler = () => {
      const userHasStartedTyping = form.name || form.email || form.message;
      if ((phase === 'form' && userHasStartedTyping) || sending) return; // don't nuke user progress
      setTyped(0);
      setPhase('intro');
      lastTriggerRef.current = Date.now();
    };
    window.addEventListener('contact:open', handler);
    return () => window.removeEventListener('contact:open', handler);
  }, [phase, form, sending]);

  const validateEmail = (val) => {
    if (!val) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(val) ? '' : 'Invalid email address';
  };
  const change = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'email') setErrors(err => ({ ...err, email: validateEmail(value) }));
  };
  const canSend = form.name && form.email && form.message && !errors.email;

  const send = async () => {
    if (!canSend) return;
    setSending(true);
  const mode = (process.env.REACT_APP_CONTACT_MODE || 'sheet').toLowerCase();

    // New: Direct Google Sheet via Apps Script WebApp (no backend server)
    if (mode === 'sheet') {
      try {
        const endpoint = process.env.REACT_APP_SHEET_WEBAPP_URL;
        if (!endpoint) throw new Error('Missing REACT_APP_SHEET_WEBAPP_URL');
        const sheetDebug = process.env.REACT_APP_SHEET_DEBUG === 'true';
        const params = new URLSearchParams({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          clientTimestamp: new Date().toISOString(),
        });
        const url = endpoint + '?' + params.toString();
        if (sheetDebug) console.log('[Sheet][debug] GET =>', url);
        const res = await fetch(url, { redirect: 'follow' });
        if (sheetDebug) console.log('[Sheet][debug] Response status:', res.status);
        setPhase('sent');
        setDeliveredVisible(true);
        setForm({ name: '', email: '', message: '' });
        setToast({ open: true, type: 'success', msg: 'Transmission logged to sheet.' });
      } catch (e) {
        console.error('Sheet submit failed', e);
        setToast({ open: true, type: 'error', msg: 'Sheet submit failed. Check web app URL.' });
      } finally {
        setSending(false);
      }
      return;
    }
  // (Former Google Forms path removed — replaced by direct Sheet mode.)

    // Default EmailJS mode
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key';
    const toEmail = process.env.REACT_APP_EMAILJS_TO_EMAIL || 'padaliaadish@gmail.com';
    const debug = process.env.REACT_APP_EMAILJS_DEBUG === 'true';
    if (debug) {
      console.log('[EmailJS][debug] Attempting send', { serviceId, templateId, publicKeyMasked: publicKey ? publicKey.slice(0,6)+'***' : null, payload: { from_name: form.name, reply_to: form.email, message: form.message, from_email: form.email, to_email: toEmail } });
    }

    // Helper: always save to Google Sheet regardless of email outcome
    const saveToSheet = async () => {
      const sheetEndpoint = process.env.REACT_APP_SHEET_WEBAPP_URL;
      if (!sheetEndpoint) { console.warn('[Sheet] No REACT_APP_SHEET_WEBAPP_URL configured, skipping sheet save.'); return; }
      try {
        const params = new URLSearchParams({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          clientTimestamp: new Date().toISOString(),
        });
        const url = sheetEndpoint + '?' + params.toString();
        await fetch(url, { redirect: 'follow' });
        console.log('[Sheet] Saved to Google Sheet successfully');
      } catch (sheetErr) {
        console.error('[Sheet] Failed to save to sheet', sheetErr);
      }
    };

    let emailSent = false;
    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
          from_email: form.email,
          to_email: toEmail
        },
        publicKey
      );
      if (debug) console.log('[EmailJS][debug] Success', result);
      emailSent = true;
    } catch (e) {
      console.error('Email send failed', e);
      let detail = '';
      if (e?.text) detail = e.text;
      if (e?.status) detail = `HTTP ${e.status} ${detail}`;
      if (debug) console.log('[EmailJS][debug] Failure detail:', detail || e);
    }

    // Always save to sheet (backup log of every submission)
    await saveToSheet();

    if (emailSent) {
      setPhase('sent');
      setDeliveredVisible(true);
      setForm({ name: '', email: '', message: '' });
      setToast({ open: true, type: 'success', msg: 'Transmission sent successfully.' });
    } else {
      // Email failed but sheet was attempted as backup
      setPhase('sent');
      setDeliveredVisible(true);
      setForm({ name: '', email: '', message: '' });
      setToast({ open: true, type: 'success', msg: 'Email unavailable — message saved to backup sheet.' });
    }
    setSending(false);
  };

  const activeMode = (process.env.REACT_APP_CONTACT_MODE || 'sheet').toLowerCase();

  return (
  <Box ref={containerRef} sx={{ position:'relative', maxWidth:520, mx:'auto', mt:6, mb:4, p:{ xs:3, md:5 }, bgcolor:'#06071d', borderRadius:4, boxShadow:'0 0 28px -4px #0db8ef70 inset, 0 0 32px #0db8ef30', overflow:'hidden', minHeight: phase==='idle'? 300: 'auto' }}>
      <ConsoleLights />
      <HoloIcons />
      <AnimatePresence mode='wait'>
  {phase === 'intro' && (
          <motion.div key='intro' initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:30 }} transition={{ duration:.7 }} style={{ textAlign:'center', paddingTop:60 }}>
            <Typography sx={{ fontFamily:'Anton, monospace', letterSpacing:2, fontSize:'1.9rem', color:'#0db8ef' }}>
              {intro.slice(0, typed)}<span style={{ opacity: typed % 2 ? 1: .2 }}>|</span>
            </Typography>
          </motion.div>
        )}
        {phase === 'handshake' && (
          <motion.div key='handshake' initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:.6 }} style={{ textAlign:'center', paddingTop:80 }}>
            <Typography sx={{ fontFamily:'Anton, monospace', letterSpacing:2, fontSize:'1.6rem', color:'#0db8ef', mb:1 }}>
              Connection established
            </Typography>
            <Typography sx={{ color:'#94a3b8', fontSize:'.8rem', letterSpacing:1 }}>Initializing secure transmission interface...</Typography>
          </motion.div>
        )}
        {phase === 'form' && (
          <motion.div key='form' initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-60 }} transition={{ duration:.65 }}>
            <Typography align='center' sx={{ color:'#e6f1ff', fontFamily:'Anton, monospace', letterSpacing:2, fontSize:'1.6rem', mb:2 }}>Space Console Transmission</Typography>
            <Stack spacing={2}>
              <TextField variant='filled' label='Name' name='name' value={form.name} onChange={change} fullWidth sx={fieldSx} />
              <TextField variant='filled' label='Email' name='email' value={form.email} onChange={change} fullWidth sx={fieldSx} error={!!errors.email} helperText={errors.email || ' '} />
              <TextField variant='filled' label='Message' name='message' value={form.message} onChange={change} fullWidth multiline rows={4} sx={fieldSx} />
              <Button variant='contained' disabled={!canSend || sending} onClick={send} sx={btnSx}>{sending ? 'Transmitting...' : 'Send Transmission'}</Button>
            </Stack>
          </motion.div>
        )}
        {phase === 'sent' && (
          <motion.div key='sent' initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:.6 }} style={{ textAlign:'center', paddingTop:60 }}>
            <Typography sx={{ fontFamily:'Anton, monospace', letterSpacing:2, fontSize:'2rem', color:'#0db8ef' }}>Transmission Sent!</Typography>
            <Typography sx={{ color:'#e6f1ff', mt:2 }}>Your message has reached mission control. We'll reply soon.</Typography>
      {deliveredVisible && (
              <AnimatePresence>
                <motion.div key='delivered-badge' initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ delay:.4, duration:.4 }} style={{ display:'inline-block' }}>
                  <Box sx={{ mt:3, px:1.8, py:.6, borderRadius:999, fontSize:'.55rem', letterSpacing:.8, fontWeight:700, bgcolor:'#0db8ef12', color:'#0db8ef', border:'1px solid #0db8ef40', textTransform:'uppercase' }}>
                    {activeMode === 'sheet' ? 'Logged (Google Sheet)' : 'Delivered'}
                  </Box>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <IconButton
            key={label}
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            sx={{
              color: '#0db8ef',
              '&:hover': {
                color: '#f6bb48',
                bgcolor: 'rgba(13, 184, 239, 0.12)',
              },
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </IconButton>
        ))}
      </Stack>
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))} anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert severity={toast.type} variant='filled' onClose={() => setToast(t => ({ ...t, open: false }))} sx={{ bgcolor: toast.type==='success'? '#0db8ef':'#b91c1c' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const ConsoleLights = () => (
  <Box sx={{ position:'absolute', top:14, left:22, display:'flex', gap:1.5 }}>
    {['#0db8ef','#f6bb48','#ffffff'].map((c,i) => (
      <Box key={c} sx={{ width:12, height:12, borderRadius:'50%', background:c, boxShadow:`0 0 12px 2px ${c}99`, animation:`blink${i} 1.2s ease-in-out ${i*.2}s infinite alternate` }} />
    ))}
  </Box>
);

const HoloIcons = () => (
  <Box sx={{ position:'absolute', right:26, top:26, display:'flex', flexDirection:'column', gap:2 }}>
    <motion.div animate={{ y:[0,-14,0], rotate:[0,4,0] }} transition={{ repeat:Infinity, duration:2.4 }} style={{ filter:'drop-shadow(0 0 12px #0db8ef)' }}>
      <svg width='40' height='40' viewBox='0 0 40 40' fill='none'>
        <circle cx='20' cy='20' r='17' stroke='#0db8ef' strokeWidth='2.5' fill='rgba(13,184,239,0.08)' />
        <path d='M20 11v9l7 4' stroke='#f6bb48' strokeWidth='2' strokeLinecap='round' />
      </svg>
    </motion.div>
    <motion.div animate={{ x:[0,10,0], scale:[1,1.12,1] }} transition={{ repeat:Infinity, duration:3 }} style={{ filter:'drop-shadow(0 0 10px #f6bb48)' }}>
      <svg width='34' height='34' viewBox='0 0 34 34' fill='none'>
        <rect x='6' y='6' width='22' height='22' rx='7' stroke='#f6bb48' strokeWidth='2' fill='rgba(246,187,72,0.07)' />
        <circle cx='17' cy='17' r='4.2' fill='#0db8ef' />
      </svg>
    </motion.div>
  </Box>
);

const fieldSx = {
  '& .MuiFilledInput-root': { bgcolor:'#0b1424', borderRadius:2, '&:hover':{ bgcolor:'#0f1d33' } },
  '& .MuiInputLabel-root': { color:'#0db8ef' },
  '& .MuiInputBase-input': { color:'#e6f1ff', fontWeight:600 }
};

const btnSx = {
  bgcolor:'#0db8ef', color:'#0b1424', fontWeight:700, letterSpacing:1, fontSize:'1rem', borderRadius:2, boxShadow:'0 0 12px #0db8ef80',
  '&:hover': { bgcolor:'#f6bb48', color:'#0b1424' }, transition:'all .35s'
};

export default ContactConsole;
