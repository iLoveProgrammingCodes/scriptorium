const $ = (id) => document.getElementById(id);

// Referencias
const inTitle = $('in-title'), inSynop = $('in-synop'), inFont = $('in-font'),
      inAlign = $('in-align'), rBorderW = $('r-border-w'), rRadius = $('r-radius'),
      colBorder = $('col-border'), colAccent = $('col-accent'), inUrl = $('in-url'),
      inStatus = $('in-status'), inFile = $('in-file'), inRating = $('in-rating'),
      inShowRating = $('in-show-rating'), inHashtags = $('in-hashtags'),
      inResolution = $('in-resolution'), inTitleSize = $('in-title-size');

const dTitle = $('display-title'), dSynop = $('display-synop'), dCard = $('main-card'),
      dAlign = $('align-target'), dContainer = $('fit-container'), dQr = $('display-qr'),
      dRating = $('display-rating'), dGenresRow = $('genres-row'), dHashtagsRow = $('hashtags-row');

let selectedGenres = [];

// Auto-fit
const autoFit = () => {
    let fSynop = 14;
    const fTitle = parseInt(inTitleSize.value) || 45;
    const limit = 560;
    dSynop.style.fontSize = fSynop + "px";
    dTitle.style.fontSize = fTitle + "px";
    while (dContainer.offsetHeight > limit && fSynop > 7) {
        fSynop -= 0.5;
        dSynop.style.fontSize = fSynop + "px";
    }
};

// Eventos
inTitle.oninput = () => { dTitle.innerText = inTitle.value || "TÍTULO"; autoFit(); };
inSynop.oninput = () => { dSynop.innerText = inSynop.value || "Sinopsis..."; autoFit(); };
inFont.onchange = () => { dTitle.style.fontFamily = inFont.value; autoFit(); };
inTitleSize.oninput = () => { dTitle.style.fontSize = inTitleSize.value + "px"; autoFit(); };
inAlign.onchange = () => { dAlign.className = 'card-content-wrapper ' + inAlign.value; };

rBorderW.oninput = () => dCard.style.borderWidth = rBorderW.value + 'px';
rRadius.oninput = () => dCard.style.borderRadius = rRadius.value + 'px';
colBorder.oninput = () => dCard.style.borderColor = colBorder.value;
colAccent.oninput = () => {
    document.querySelectorAll('.genre-item').forEach(e => e.style.background = colAccent.value);
    document.querySelectorAll('.hashtag-item').forEach(e => e.style.color = colAccent.value);
    document.documentElement.style.setProperty('--accent', colAccent.value);
};

inShowRating.onchange = () => {
    dRating.style.display = inShowRating.value === 'yes' ? 'flex' : 'none';
};

inRating.oninput = () => {
    const score = parseFloat(inRating.value) || 0;
    dRating.querySelector('.score').innerText = score.toFixed(1);
};

document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.onclick = () => {
        const genre = btn.dataset.genre;
        btn.classList.toggle('active');
        if (selectedGenres.includes(genre)) {
            selectedGenres = selectedGenres.filter(g => g !== genre);
        } else {
            selectedGenres.push(genre);
        }
        updateGenres();
    };
});

const updateGenres = () => {
    dGenresRow.innerHTML = '';
    selectedGenres.forEach(genre => {
        const tag = document.createElement('span');
        tag.className = 'genre-item';
        tag.innerText = genre;
        tag.style.background = colAccent.value;
        dGenresRow.appendChild(tag);
    });
    autoFit();
};

inHashtags.oninput = () => {
    const tags = inHashtags.value.trim().split(/\s+/).filter(t => t);
    dHashtagsRow.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'hashtag-item';
        span.innerText = tag.startsWith('#') ? tag : '#' + tag;
        span.style.color = colAccent.value;
        dHashtagsRow.appendChild(span);
    });
    autoFit();
};

inUrl.oninput = () => {
    if (inUrl.value) {
        dQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(inUrl.value)}`;
        dQr.style.display = 'block';
    } else {
        dQr.style.display = 'none';
    }
};

inFile.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => $('card-bg').style.backgroundImage = `url(${ev.target.result})`;
    reader.readAsDataURL(e.target.files[0]);
};

inStatus.onchange = () => {
    const opt = inStatus.options[inStatus.selectedIndex];
    const badge = $('display-status');
    badge.innerText = inStatus.value;
    badge.style.color = opt.dataset.color;
    badge.style.borderColor = opt.dataset.color;
};

$('download-btn').onclick = function() {
    const scale = parseInt(inResolution.value);
    html2canvas($('capture-area'), { scale: scale, useCORS: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Scriptium_${inTitle.value || 'Card'}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
};