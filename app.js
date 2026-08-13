const PAGES = [
  "home", "map", "theory",
  "l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l12", "l11",
  "glossary"
];

const LESSONS = ["theory","l0","l1","l2","l3","l4","l5","l6","l7","l8","l9","l10","l12","l11"];
const KEY = "cv-learn-done";

function doneSet() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
  catch { return new Set(); }
}
function saveDone(set) {
  localStorage.setItem(KEY, JSON.stringify([...set]));
}

function show(id) {
  if (!PAGES.includes(id)) id = "home";
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + id));
  document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("active", a.dataset.page === id));
  location.hash = id;
  window.scrollTo(0, 0);
  refreshProgress();
  const side = document.querySelector(".sidebar");
  if (side && window.matchMedia("(max-width: 920px)").matches) side.classList.add("collapsed");
}

function refreshProgress() {
  const done = doneSet();
  const n = LESSONS.filter(x => done.has(x)).length;
  const pct = Math.round((n / LESSONS.length) * 100);
  const bar = document.getElementById("progress-fill");
  const txt = document.getElementById("progress-text");
  if (bar) bar.style.width = pct + "%";
  if (txt) txt.textContent = n + " / " + LESSONS.length + " lessons marked done";
  document.querySelectorAll(".nav a[data-page]").forEach(a => {
    a.classList.toggle("done", done.has(a.dataset.page));
  });
}

function markDone(id) {
  const s = doneSet();
  s.add(id);
  saveDone(s);
  refreshProgress();
}

function nextPage(id) {
  const i = PAGES.indexOf(id);
  return PAGES[Math.min(PAGES.length - 1, i + 1)];
}
function prevPage(id) {
  const i = PAGES.indexOf(id);
  return PAGES[Math.max(0, i - 1)];
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-page]");
  if (a && a.dataset.page) {
    e.preventDefault();
    show(a.dataset.page);
  }
  const mark = e.target.closest("[data-mark]");
  if (mark) {
    markDone(mark.dataset.mark);
    const nxt = nextPage(mark.dataset.mark);
    show(nxt);
  }
});

window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "") || "home";
  if (PAGES.includes(id)) show(id);
});

/* ---------- quizzes ---------- */
const QUIZZES = {
  theory: [
    { q: "Machine learning means:", opts: ["Writing if/else for every photo", "A program that improves from examples", "Only drawing boxes", "Deleting test data"], a: 1, e: "You show examples (features + labels). The model adjusts weights so future guesses get better." },
    { q: "A CNN is a neural net that:", opts: ["Only works on spreadsheets", "Slides small filters over an image", "Always uses softmax with 1 class", "Never uses ReLU"], a: 1, e: "Convolution = shared filters. That is what makes it a Convolutional Neural Network." },
    { q: "Loss vs metric:", opts: ["They are the same number", "Loss is what training shrinks; a metric is a score you watch", "Metric updates weights", "Loss is always a percent"], a: 1, e: "compile(loss=..., metrics=[...]). Adam follows the loss. Accuracy/Dice/F1 are reports." },
    { q: "After a basic CNN, transfer learning means:", opts: ["Throwing ImageNet away", "Reusing a net already trained on a huge dataset", "Augmenting the test set", "Predicting without images"], a: 1, e: "Freeze a backbone (MobileNet), train a small head, then optionally fine-tune slowly." }
  ],
  l0: [
    { q: "A grayscale pixel value of 0 usually means:", opts: ["White", "Black", "Red", "Transparent"], a: 1, e: "In typical image arrays, 0 is black and 255 is white." },
    { q: "An RGB image with height 28 and width 28 has shape:", opts: ["(28, 28)", "(28, 28, 1)", "(28, 28, 3)", "(3, 28)"], a: 2, e: "Color images have 3 channels: red, green, blue." },
    { q: "Classification means:", opts: ["Drawing a box around an object", "Assigning a label/class", "Measuring distance between faces", "Removing noise"], a: 1, e: "Classification picks a class. Detection finds where. Segmentation labels every pixel. Recognition asks who." }
  ],
  l1: [
    { q: "For diabetes yes/no, the output activation should be:", opts: ["softmax", "relu", "sigmoid", "tanh"], a: 2, e: "Sigmoid squashes one number into a probability between 0 and 1." },
    { q: "binary_crossentropy is used when:", opts: ["There are 10 exclusive classes", "There are two outcomes (yes/no)", "Labels are one-hot", "Images are RGB"], a: 1, e: "Binary problems use sigmoid + binary crossentropy." },
    { q: "A Dense layer means:", opts: ["Only nearby pixels connect", "Every input connects to every neuron", "Weights are frozen", "The layer does convolution"], a: 1, e: "Dense = fully connected." }
  ],
  l2: [
    { q: "Flatten on a 28×28 image produces:", opts: ["28 values", "56 values", "784 values", "10 values"], a: 2, e: "28 × 28 = 784. Each pixel becomes one number in a long list." },
    { q: "softmax is used because:", opts: ["It detects edges", "It outputs 10 probabilities that sum to 1", "It reduces image size", "It prevents overfitting"], a: 1, e: "For exclusive multi-class problems, softmax turns scores into a probability distribution." },
    { q: "Fashion-MNIST used sparse_categorical_crossentropy because labels were:", opts: ["One-hot vectors", "Integers 0–9", "Text names", "Probabilities"], a: 1, e: "Integer labels pair with sparse_categorical_crossentropy. One-hot labels pair with categorical_crossentropy." }
  ],
  l3: [
    { q: "Why reshape MNIST to (28, 28, 1)?", opts: ["To make it color", "Conv2D needs a channel dimension", "To one-hot encode pixels", "To reduce memory"], a: 1, e: "CNNs expect (height, width, channels). Grayscale still needs channel = 1." },
    { q: "MaxPooling2D(2,2) mostly:", opts: ["Adds color", "Keeps the strongest value in each 2×2 block", "Increases image size", "One-hot encodes labels"], a: 1, e: "Pooling downsamples and keeps the most activated feature." },
    { q: "Dropout(0.5) during training:", opts: ["Deletes the model", "Randomly turns off 50% of neurons to reduce overfitting", "Doubles learning rate", "Converts RGB to gray"], a: 1, e: "Dropout is regularization. It is usually off at test time." }
  ],
  l4: [
    { q: "A convolution filter learns:", opts: ["The class name", "A small local pattern (edge, texture, shape)", "The whole image at once", "The learning rate"], a: 1, e: "Early filters find edges. Deeper filters find parts, then objects." },
    { q: "Compared with Flatten+Dense, CNNs are better for images because they:", opts: ["Ignore nearby pixels", "Share the same filter across the image", "Need no data", "Cannot use ReLU"], a: 1, e: "Weight sharing and local connectivity keep spatial structure and use fewer parameters." },
    { q: "Stride 2 means the filter:", opts: ["Never moves", "Jumps 2 pixels each step", "Looks at 2 images", "Uses 2 colors"], a: 1, e: "Larger stride shrinks the feature map faster." }
  ],
  l5: [
    { q: "You should augment:", opts: ["Train set only", "Test set only", "Train and test the same way", "Neither"], a: 0, e: "Test/validation must stay honest. Augment training so the model sees variety." },
    { q: "A large train-accuracy minus test-accuracy gap means:", opts: ["Perfect model", "Underfitting", "Overfitting", "The loss is wrong"], a: 2, e: "The model memorized training images and failed to generalize." },
    { q: "RandomHorizontalFlip is useful for CIFAR objects because:", opts: ["Cats look similar flipped", "It changes the class label", "Test images must be flipped", "It removes color"], a: 0, e: "A flipped cat is still a cat. Do not flip digits if 6 vs 9 matters." }
  ],
  l6: [
    { q: "include_top=False means:", opts: ["No input image", "Remove ImageNet's 1000-class head", "Freeze nothing", "Use grayscale"], a: 1, e: "You keep the visual backbone and attach your own classifier." },
    { q: "Phase 1 of transfer learning usually:", opts: ["Trains every layer with a huge learning rate", "Freezes the backbone and trains a new head", "Deletes ImageNet weights", "Augments the test set"], a: 1, e: "First reuse learned features. Then optionally fine-tune slowly." },
    { q: "Fine-tuning uses a smaller learning rate to:", opts: ["Speed up forever", "Avoid destroying useful pretrained weights", "Increase dropout", "Convert to text"], a: 1, e: "A tiny LR (like 1e-5) gently adapts later layers." }
  ],
  l7: [
    { q: "TF Hub's text layer mainly:", opts: ["Draws pictures", "Turns sentences into number vectors (embeddings)", "Detects faces", "Does max pooling on pixels"], a: 1, e: "Same transfer-learning idea as vision: reuse a pretrained encoder." },
    { q: "IMDB is binary sentiment, so the last layer is:", opts: ["softmax with 10 units", "sigmoid with 1 unit", "ReLU with 784 units", "Conv2D"], a: 1, e: "One probability: positive vs negative." }
  ],
  l8: [
    { q: "A Siamese network uses two towers with:", opts: ["Different random weights always", "Shared weights", "No CNN", "Softmax over 40 people"], a: 1, e: "Shared weights make the comparison fair and enable one-shot matching." },
    { q: "Contrastive loss for a SAME pair wants:", opts: ["Large distance", "Small distance", "Random distance", "Softmax 0.5"], a: 1, e: "Same identity → pull embeddings together. Different → push apart by a margin." },
    { q: "One-shot learning here means:", opts: ["Train for one epoch", "Recognize a new person from very few photos", "Use one pixel", "Skip validation"], a: 1, e: "You compare embeddings instead of training a new class from scratch." }
  ],
  l9: [
    { q: "Face detection vs recognition:", opts: ["Same thing", "Detection finds a face; recognition asks who", "Recognition finds the box", "Detection outputs 512 numbers"], a: 1, e: "Your notebook: OpenCV SSD finds the box, ArcFace embeds the crop, cosine matches identity." },
    { q: "If embeddings are L2-normalized, cosine similarity is:", opts: ["The sum of pixels", "The dot product", "Always 2", "Binary crossentropy"], a: 1, e: "After unit-length normalization, sim = a · b, distance = 1 − sim." },
    { q: "A lower cosine-distance threshold is:", opts: ["Looser matching", "Stricter matching", "Unrelated", "Only for text"], a: 1, e: "Smaller allowed distance means the faces must look more similar." }
  ],
  l10: [
    { q: "Class weights in medical data are used because:", opts: ["GPUs like weights", "Healthy images often outnumber rare severe cases", "Images are too big", "Softmax needs them"], a: 1, e: "Without weights the model can cheat by always predicting 'No DR'." },
    { q: "Grad-CAM is useful because:", opts: ["It trains faster", "It shows which image region drove the prediction", "It augments data", "It detects faces"], a: 1, e: "Doctors need to see that the model looked at lesions, not corners or text." },
    { q: "Quadratic weighted kappa cares about:", opts: ["Only exact accuracy", "How serious an off-by-one staging error is", "Learning rate only", "Batch size only"], a: 1, e: "Predicting Severe as Moderate is less bad than predicting Severe as Healthy." }
  ],
  l12: [
    { q: "In this tumor notebook, the label y is:", opts: ["A class name like “tumor”", "A bounding box", "An image-sized 0/1 mask", "A 512-D embedding"], a: 2, e: "Each pixel of y says tumor or not. Shape matches the MRI: (128, 128, 1)." },
    { q: "U-Net skip connections exist so the decoder gets:", opts: ["A learning rate", "Both deep “what” and shallow “where”", "Softmax over 10 classes", "Face embeddings"], a: 1, e: "Encoder features are concatenated onto the upsampled map so tumor edges stay sharp." },
    { q: "Val accuracy ~99% with Dice loss stuck high means:", opts: ["Perfect tumor outlines", "The model is mostly predicting background", "The dataset is empty", "Softmax is wrong"], a: 1, e: "Tumors are tiny. All-black masks score high accuracy and terrible Dice. Trust overlap, not accuracy." }
  ],
  l11: [
    { q: "The usual vision pipeline order is:", opts: ["Predict → then normalize", "Load → inspect → normalize → model → train → evaluate", "Fine-tune before any data", "Augment the test set first"], a: 1, e: "Every practical in this folder follows that loop." },
    { q: "If you have few images, first try:", opts: ["A huge CNN from scratch", "Transfer learning + augmentation", "Deleting validation", "Integer overflow"], a: 1, e: "That is why flowers, retinopathy, and many real CV tasks start from ImageNet backbones." },
    { q: "Need a pixel-perfect tumor outline. You should train:", opts: ["Softmax over 10 clothes", "A U-Net with Dice loss on masks", "Only Grad-CAM on a classifier", "Cosine matching"], a: 1, e: "Masks need segmentation. Grad-CAM only explains a classifier; it is not a trained outline." }
  ]
};

function renderQuizzes() {
  Object.entries(QUIZZES).forEach(([lesson, items]) => {
    const root = document.getElementById("quiz-" + lesson);
    if (!root) return;
    root.innerHTML = items.map((item, i) => `
      <div class="q">${i + 1}. ${item.q}</div>
      ${item.opts.map((o, j) => `
        <label><input type="radio" name="${lesson}-${i}" value="${j}"> ${o}</label>
      `).join("")}
    `).join("") + `<button class="btn primary" data-grade="${lesson}" style="margin-top:0.8rem">Check answers</button><div class="result" id="quiz-res-${lesson}"></div>`;
  });
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-grade]");
  if (!b) return;
  const lesson = b.dataset.grade;
  const items = QUIZZES[lesson];
  let correct = 0;
  const notes = [];
  items.forEach((item, i) => {
    const picked = document.querySelector(`input[name="${lesson}-${i}"]:checked`);
    const ok = picked && Number(picked.value) === item.a;
    if (ok) correct++;
    notes.push(`<div class="explain">${ok ? "Correct" : "Not quite"}. ${item.e}</div>`);
  });
  document.getElementById("quiz-res-" + lesson).innerHTML =
    `${correct} / ${items.length} correct` + notes.join("");
});

/* ---------- labs ---------- */
function relu(x) { return Math.max(0, x); }
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function initNeuron() {
  const box = document.getElementById("lab-neuron");
  if (!box) return;
  const fields = ["x1","x2","x3","x4","w1","w2","w3","w4","b"];
  const vals = { x1: 6, x2: 148, x3: 72, x4: 33.6, w1: 0.02, w2: 0.04, w3: -0.01, w4: 0.03, b: -2.2 };
  box.innerHTML = `
    <p>This is one neuron, like in <code>Deep_Neural_Network (1).ipynb</code>. Four inputs (think pregnancies, glucose, blood pressure, BMI) are multiplied by weights, plus a bias, then an activation.</p>
    <div class="grid-2" id="neuron-sliders"></div>
    <div class="out" id="neuron-out"></div>
  `;
  const sliders = document.getElementById("neuron-sliders");
  const meta = {
    x1: [0, 15, 0.1, "Input x1"], x2: [0, 200, 1, "Input x2"], x3: [0, 120, 1, "Input x3"], x4: [10, 50, 0.1, "Input x4"],
    w1: [-0.2, 0.2, 0.005, "Weight w1"], w2: [-0.2, 0.2, 0.005, "Weight w2"], w3: [-0.2, 0.2, 0.005, "Weight w3"], w4: [-0.2, 0.2, 0.005, "Weight w4"],
    b: [-5, 5, 0.1, "Bias"]
  };
  fields.forEach(k => {
    const [min, max, step, label] = meta[k];
    const wrap = document.createElement("div");
    wrap.innerHTML = `<label>${label}: <span id="v-${k}">${vals[k]}</span></label>
      <input type="range" id="${k}" min="${min}" max="${max}" step="${step}" value="${vals[k]}">`;
    sliders.appendChild(wrap);
  });
  const update = () => {
    fields.forEach(k => {
      vals[k] = Number(document.getElementById(k).value);
      document.getElementById("v-" + k).textContent = vals[k];
    });
    const z = vals.x1*vals.w1 + vals.x2*vals.w2 + vals.x3*vals.w3 + vals.x4*vals.w4 + vals.b;
    document.getElementById("neuron-out").innerHTML =
      `z = w·x + b = <b>${z.toFixed(3)}</b><br>
       ReLU(z) = <b>${relu(z).toFixed(3)}</b> (hidden layers)<br>
       sigmoid(z) = <b>${sigmoid(z).toFixed(3)}</b> (diabetes probability; &gt; 0.5 → class 1)`;
  };
  sliders.addEventListener("input", update);
  update();
}

function initOneHot() {
  const box = document.getElementById("lab-onehot");
  if (!box) return;
  box.innerHTML = `
    <p>Pick a digit label. The notebook turns it into a 10-length vector for <code>categorical_crossentropy</code>.</p>
    <label>Label y</label>
    <input type="range" id="oh-y" min="0" max="9" value="5">
    <div class="out" id="oh-out"></div>
  `;
  const upd = () => {
    const y = Number(document.getElementById("oh-y").value);
    const v = Array.from({length:10}, (_, i) => i === y ? 1 : 0);
    document.getElementById("oh-out").innerHTML =
      `y = <b>${y}</b><br>one-hot = [${v.join(", ")}]<br>
       Fashion-MNIST skipped this and used <code>sparse_categorical_crossentropy</code> with the integer ${y} directly.`;
  };
  box.addEventListener("input", upd);
  upd();
}

function softmax(arr) {
  const m = Math.max(...arr);
  const ex = arr.map(v => Math.exp(v - m));
  const s = ex.reduce((a,b) => a+b, 0);
  return ex.map(v => v / s);
}

function initSoftmax() {
  const box = document.getElementById("lab-softmax");
  if (!box) return;
  const labels = ["T-shirt","Trouser","Pullover","Dress","Coat","Sandal","Shirt","Sneaker","Bag","Boot"];
  box.innerHTML = `<p>These are raw class scores (logits). Softmax turns them into probabilities. <code>argmax</code> picks the predicted class — same as the Fashion-MNIST notebook.</p>
    <div id="sm-sliders"></div>
    <div class="out" id="sm-out"></div>`;
  const sliders = document.getElementById("sm-sliders");
  const scores = [0.2, 2.8, 0.1, 0.4, 0.3, -0.2, 1.1, -0.4, 0.0, -0.1];
  labels.forEach((name, i) => {
    const d = document.createElement("div");
    d.innerHTML = `<label>${name}: <span id="smv-${i}">${scores[i]}</span></label>
      <input type="range" min="-3" max="4" step="0.1" value="${scores[i]}" data-i="${i}">`;
    sliders.appendChild(d);
  });
  const upd = () => {
    sliders.querySelectorAll("input").forEach(inp => {
      const i = Number(inp.dataset.i);
      scores[i] = Number(inp.value);
      document.getElementById("smv-" + i).textContent = scores[i].toFixed(1);
    });
    const p = softmax(scores);
    const pred = p.indexOf(Math.max(...p));
    document.getElementById("sm-out").innerHTML =
      p.map((x,i) => `${labels[i].padEnd(8," ")} ${ (x*100).toFixed(1).padStart(5)}% ${"█".repeat(Math.round(x*20))}`).join("<br>") +
      `<br><br>Predicted class = <b>${pred} (${labels[pred]})</b>`;
  };
  sliders.addEventListener("input", upd);
  upd();
}

function initConv() {
  const box = document.getElementById("lab-conv");
  if (!box) return;
  const n = 5;
  const img = [
    [0,0,0,0,0],
    [0,1,1,1,0],
    [0,1,0,1,0],
    [0,1,1,1,0],
    [0,0,0,0,0]
  ];
  const k = [[-1,0,1],[-2,0,2],[-1,0,1]]; // Sobel-x
  box.innerHTML = `
    <p>Click pixels to toggle 0/1. Edit the 3×3 kernel. This is valid convolution (no padding): 5×5 image → 3×3 feature map. Same idea as <code>Conv2D(32, kernel_size=(3,3))</code>.</p>
    <div class="grid-2">
      <div><strong>Image</strong><div class="grid-pixels" id="conv-img"></div></div>
      <div><strong>Kernel</strong><div class="grid-kernel" id="conv-k"></div>
        <div class="row" style="margin-top:0.5rem">
          <button class="btn" data-kernel="edge">Vertical edge</button>
          <button class="btn" data-kernel="blur">Blur</button>
          <button class="btn" data-kernel="ident">Identity</button>
        </div>
      </div>
    </div>
    <strong>Feature map</strong>
    <div class="grid-out" id="conv-out"></div>
    <p class="lede" style="font-size:0.95rem">A positive cell means “this pattern is present here.” Stack many filters and you get 32 or 64 feature maps, like the MNIST CNN.</p>
  `;
  const imgEl = document.getElementById("conv-img");
  imgEl.style.gridTemplateColumns = `repeat(${n}, 28px)`;
  const kEl = document.getElementById("conv-k");
  kEl.style.gridTemplateColumns = "repeat(3, 50px)";
  const outEl = document.getElementById("conv-out");
  outEl.style.gridTemplateColumns = "repeat(3, 36px)";

  function draw() {
    imgEl.innerHTML = "";
    for (let r=0;r<n;r++) for (let c=0;c<n;c++) {
      const d = document.createElement("div");
      d.className = "cell" + (img[r][c] ? " on" : "");
      d.textContent = img[r][c];
      d.onclick = () => { img[r][c] = img[r][c] ? 0 : 1; draw(); };
      imgEl.appendChild(d);
    }
    kEl.innerHTML = "";
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) {
      const inp = document.createElement("input");
      inp.className = "kcell";
      inp.value = k[r][c];
      inp.onchange = () => { k[r][c] = Number(inp.value) || 0; draw(); };
      kEl.appendChild(inp);
    }
    outEl.innerHTML = "";
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) {
      let s = 0;
      for (let i=0;i<3;i++) for (let j=0;j<3;j++) s += img[r+i][c+j] * k[i][j];
      const d = document.createElement("div");
      d.className = "cell";
      d.textContent = s;
      const t = Math.max(-8, Math.min(8, s));
      const g = Math.round(200 - t * 12);
      d.style.background = `rgb(${g},${g},${220})`;
      outEl.appendChild(d);
    }
  }
  box.addEventListener("click", (e) => {
    const t = e.target.closest("[data-kernel]");
    if (!t) return;
    const presets = {
      edge: [[-1,0,1],[-2,0,2],[-1,0,1]],
      blur: [[1,1,1],[1,1,1],[1,1,1]],
      ident: [[0,0,0],[0,1,0],[0,0,0]]
    };
    presets[t.dataset.kernel].forEach((row,i) => row.forEach((v,j) => k[i][j]=v));
    draw();
  });
  draw();
}

function initPool() {
  const box = document.getElementById("lab-pool");
  if (!box) return;
  const g = [[1,3,2,0],[8,4,1,2],[0,6,7,1],[2,2,9,3]];
  box.innerHTML = `<p>Max-pool 2×2, stride 2: keep the largest number in each block. This is <code>MaxPooling2D(pool_size=(2,2))</code>.</p>
    <div class="row">
      <div><strong>4×4 feature map</strong><div class="grid-pixels" id="pool-in"></div></div>
      <div><strong>2×2 after pool</strong><div class="grid-pixels" id="pool-out"></div></div>
    </div>`;
  const inn = document.getElementById("pool-in");
  const out = document.getElementById("pool-out");
  inn.style.gridTemplateColumns = "repeat(4, 36px)";
  out.style.gridTemplateColumns = "repeat(2, 36px)";
  function draw() {
    inn.innerHTML = "";
    g.forEach((row,r) => row.forEach((v,c) => {
      const d = document.createElement("div");
      d.className = "cell";
      d.textContent = v;
      d.style.width = d.style.height = "36px";
      const block = (Math.floor(r/2)*2 + Math.floor(c/2));
      d.style.background = ["#f3ddd4","#d7eadf","#f6e7c8","#e4ddf3"][block];
      d.onclick = () => { g[r][c] = (v + 1) % 10; draw(); };
      inn.appendChild(d);
    }));
    out.innerHTML = "";
    for (let r=0;r<2;r++) for (let c=0;c<2;c++) {
      const m = Math.max(g[r*2][c*2], g[r*2][c*2+1], g[r*2+1][c*2], g[r*2+1][c*2+1]);
      const d = document.createElement("div");
      d.className = "cell on";
      d.style.width = d.style.height = "36px";
      d.textContent = m;
      out.appendChild(d);
    }
  }
  draw();
}

function initContrastive() {
  const box = document.getElementById("lab-contrastive");
  if (!box) return;
  box.innerHTML = `
    <p>Contrastive loss from the Siamese notebook. Label 0 = same person, 1 = different. Margin = 1.0.</p>
    <label>Distance d: <span id="cd-d">0.40</span></label>
    <input type="range" id="cd-dist" min="0" max="2" step="0.01" value="0.40">
    <label>Pair type</label>
    <div class="row">
      <label><input type="radio" name="cd-y" value="0" checked> Same (y=0)</label>
      <label><input type="radio" name="cd-y" value="1"> Different (y=1)</label>
    </div>
    <div class="out" id="cd-out"></div>
  `;
  const upd = () => {
    const d = Number(document.getElementById("cd-dist").value);
    document.getElementById("cd-d").textContent = d.toFixed(2);
    const y = Number(document.querySelector("input[name='cd-y']:checked").value);
    const loss = y === 0 ? 0.5 * d * d : 0.5 * Math.pow(Math.max(0, 1 - d), 2);
    document.getElementById("cd-out").innerHTML =
      y === 0
        ? `Same pair: loss = ½ d² = <b>${loss.toFixed(4)}</b><br>Pull embeddings together. Smaller d → smaller loss.`
        : `Different pair: loss = ½ max(0, margin−d)² = <b>${loss.toFixed(4)}</b><br>If d already &gt; 1, loss is 0. No need to push further.`;
  };
  box.addEventListener("input", upd);
  upd();
}

function initCosine() {
  const box = document.getElementById("lab-cosine");
  if (!box) return;
  box.innerHTML = `
    <p>ArcFace embeddings are L2-normalized. Then cosine similarity is just the dot product. Distance = 1 − similarity. Your attendance notebook matches if distance &lt; 0.40.</p>
    <div class="grid-2">
      <div>
        <label>Known face vector (2D demo) angle: <span id="ca1">20</span>°</label>
        <input type="range" id="ang1" min="0" max="360" value="20">
      </div>
      <div>
        <label>Probe face angle: <span id="ca2">35</span>°</label>
        <input type="range" id="ang2" min="0" max="360" value="35">
      </div>
    </div>
    <canvas id="cos-canvas" width="360" height="220" style="width:100%;background:var(--paper);border:1px solid var(--line);border-radius:8px;margin-top:0.6rem"></canvas>
    <div class="out" id="cos-out"></div>
  `;
  const c = document.getElementById("cos-canvas");
  const ctx = c.getContext("2d");
  const upd = () => {
    const a1 = Number(document.getElementById("ang1").value) * Math.PI/180;
    const a2 = Number(document.getElementById("ang2").value) * Math.PI/180;
    document.getElementById("ca1").textContent = document.getElementById("ang1").value;
    document.getElementById("ca2").textContent = document.getElementById("ang2").value;
    const v1 = [Math.cos(a1), Math.sin(a1)];
    const v2 = [Math.cos(a2), Math.sin(a2)];
    const sim = v1[0]*v2[0] + v1[1]*v2[1];
    const dist = 1 - sim;
    const match = dist < 0.40;
    ctx.clearRect(0,0,360,220);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line").trim() || "#d7ccb8";
    ctx.beginPath(); ctx.arc(180,110,80,0,Math.PI*2); ctx.stroke();
    const draw = (v, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(180,110); ctx.lineTo(180+v[0]*80, 110-v[1]*80); ctx.stroke();
    };
    draw(v1, getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
    draw(v2, getComputedStyle(document.documentElement).getPropertyValue("--ok").trim());
    document.getElementById("cos-out").innerHTML =
      `cosine similarity = <b>${sim.toFixed(3)}</b><br>
       cosine distance = <b>${dist.toFixed(3)}</b><br>
       ${match ? "<b style='color:var(--ok)'>MATCH</b> — mark attendance" : "<b style='color:var(--accent)'>NO MATCH</b> — unknown person"}`;
  };
  box.addEventListener("input", upd);
  upd();
}

function initStride() {
  const box = document.getElementById("lab-stride");
  if (!box) return;
  box.innerHTML = `
    <p>Output size of a convolution (one spatial side):</p>
    <div class="formula">out = floor( (in + 2×padding − kernel) / stride ) + 1</div>
    <div class="grid-2" style="margin-top:0.8rem">
      <div>
        <label>Input size: <span id="st-in-v">28</span></label>
        <input type="range" id="st-in" min="8" max="64" value="28">
        <label>Kernel: <span id="st-k-v">3</span></label>
        <input type="range" id="st-k" min="1" max="11" step="2" value="3">
      </div>
      <div>
        <label>Padding: <span id="st-p-v">0</span></label>
        <input type="range" id="st-p" min="0" max="5" value="0">
        <label>Stride: <span id="st-s-v">1</span></label>
        <input type="range" id="st-s" min="1" max="4" value="1">
      </div>
    </div>
    <div class="out" id="st-out"></div>
  `;
  const upd = () => {
    const inn = Number(document.getElementById("st-in").value);
    const k = Number(document.getElementById("st-k").value);
    const p = Number(document.getElementById("st-p").value);
    const s = Number(document.getElementById("st-s").value);
    document.getElementById("st-in-v").textContent = inn;
    document.getElementById("st-k-v").textContent = k;
    document.getElementById("st-p-v").textContent = p;
    document.getElementById("st-s-v").textContent = s;
    const out = Math.floor((inn + 2 * p - k) / s) + 1;
    const mnist = inn === 28 && k === 3 && p === 0 && s === 1;
    document.getElementById("st-out").innerHTML =
      (out > 0
        ? `Feature map size = <b>${out} × ${out}</b>`
        : `<b>Invalid</b> — kernel larger than padded input.`) +
      (mnist ? `<br>This is the MNIST CNN first layer: 28 → 26 with <code>padding='valid'</code>.` : "") +
      (p === Math.floor((k - 1) / 2) && s === 1 ? `<br>With this padding and stride 1, size is preserved (“same” padding).` : "");
  };
  box.addEventListener("input", upd);
  upd();
}

function initDropout() {
  const box = document.getElementById("lab-dropout");
  if (!box) return;
  const n = 12;
  box.innerHTML = `
    <p>Dropout randomly turns neurons off <em>during training</em> so the network cannot rely on any one of them. At test time, all neurons are on.</p>
    <label>Dropout rate: <span id="dr-v">0.50</span></label>
    <input type="range" id="dr-rate" min="0" max="0.9" step="0.05" value="0.5">
    <div class="row" style="margin-top:0.5rem">
      <button class="btn" id="dr-train">Resample training mask</button>
      <label><input type="checkbox" id="dr-test"> Test / inference mode</label>
    </div>
    <div class="grid-pixels" id="dr-grid" style="grid-template-columns:repeat(12, 28px);margin-top:0.7rem"></div>
    <div class="out" id="dr-out"></div>
  `;
  const grid = document.getElementById("dr-grid");
  let mask = Array(n).fill(1);
  const draw = () => {
    const rate = Number(document.getElementById("dr-rate").value);
    const test = document.getElementById("dr-test").checked;
    document.getElementById("dr-v").textContent = rate.toFixed(2);
    if (!test) mask = mask.map(() => Math.random() > rate ? 1 : 0);
    grid.innerHTML = "";
    (test ? Array(n).fill(1) : mask).forEach(on => {
      const d = document.createElement("div");
      d.className = "cell" + (on ? " on" : "");
      d.textContent = on ? "on" : "off";
      d.style.width = d.style.height = "28px";
      d.style.fontSize = "0.55rem";
      grid.appendChild(d);
    });
    const alive = test ? n : mask.reduce((a,b) => a+b, 0);
    document.getElementById("dr-out").innerHTML = test
      ? `Inference: all <b>${n}</b> neurons active. Dropout is off when you call <code>evaluate</code> / <code>predict</code>.`
      : `Training: <b>${alive}</b> / ${n} kept (about ${(1-rate)*100}% expected). MNIST CNN used Dropout(0.5) before the last Dense.`;
  };
  document.getElementById("dr-train").onclick = draw;
  box.addEventListener("input", draw);
  draw();
}

function initLossPicker() {
  const box = document.getElementById("lab-loss");
  if (!box) return;
  const cases = [
    { id: "bin", label: "Diabetes: yes / no", loss: "binary_crossentropy", act: "sigmoid, 1 unit", why: "One probability. Threshold 0.5 for class 1." },
    { id: "sp", label: "Fashion-MNIST: labels are integers 0–9", loss: "sparse_categorical_crossentropy", act: "softmax, 10 units", why: "Ten exclusive classes. Labels stay as 9, 1, 0… no one-hot needed." },
    { id: "oh", label: "MNIST: labels converted with to_categorical", loss: "categorical_crossentropy", act: "softmax, 10 units", why: "Same 10-class problem, but labels are vectors like [0,0,0,0,0,0,1,0,0,0]." },
    { id: "pt", label: "CIFAR-10 in PyTorch", loss: "nn.CrossEntropyLoss", act: "raw logits, 10 units (no softmax)", why: "PyTorch CrossEntropyLoss applies log-softmax internally. Do not softmax first." },
    { id: "si", label: "Siamese: same person vs different", loss: "contrastive loss", act: "distance between two embeddings", why: "Not a class head. Pull same identities together, push others past a margin." },
    { id: "seg", label: "Tumor masks: every pixel", loss: "dice_loss", act: "Conv2D 1×1 sigmoid, same H×W as the image", why: "The label is a mask. Dice cares about overlap of the tumor blob. Pixel accuracy will lie." }
  ];
  box.innerHTML = `
    <p>Pick the problem. The loss and last layer must match — this is the most common compile-time mistake across these notebooks.</p>
    <div class="row" id="loss-btns"></div>
    <div class="out" id="loss-out"></div>
  `;
  const btns = document.getElementById("loss-btns");
  cases.forEach(c => {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = c.label;
    b.onclick = () => {
      document.getElementById("loss-out").innerHTML =
        `<b>${c.loss}</b><br>Last layer: ${c.act}<br>${c.why}`;
    };
    btns.appendChild(b);
  });
  btns.querySelector("button").click();
}

function initDice() {
  const box = document.getElementById("lab-dice");
  if (!box) return;
  const n = 6;
  const gt = [
    [0,0,0,0,0,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
  ];
  const pr = [
    [0,0,0,0,0,0],
    [0,0,1,1,0,0],
    [0,1,1,1,0,0],
    [0,1,1,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
  ];
  box.innerHTML = `
    <p>Click cells. White = tumor. Dice = 2 × overlap / (true tumor pixels + predicted tumor pixels). Same formula as <code>dice_loss = 1 − Dice</code> in the notebook.</p>
    <div class="grid-2">
      <div><strong>Ground-truth mask</strong><div class="grid-pixels" id="dice-gt"></div></div>
      <div><strong>Predicted mask</strong><div class="grid-pixels" id="dice-pr"></div></div>
    </div>
    <div class="row">
      <button class="btn" id="dice-empty">Predict all background</button>
      <button class="btn" id="dice-copy">Copy the truth</button>
    </div>
    <div class="out" id="dice-out"></div>
  `;
  const gtEl = document.getElementById("dice-gt");
  const prEl = document.getElementById("dice-pr");
  gtEl.style.gridTemplateColumns = prEl.style.gridTemplateColumns = `repeat(${n}, 28px)`;
  function score() {
    let inter = 0, a = 0, b = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      a += gt[r][c]; b += pr[r][c];
      inter += gt[r][c] * pr[r][c];
    }
    const dice = (2 * inter) / Math.max(1, a + b);
    const acc = 1 - ((a + b - 2 * inter) / (n * n));
    document.getElementById("dice-out").innerHTML =
      `overlap = <b>${inter}</b> · true = ${a} · pred = ${b}<br>
       Dice = <b>${dice.toFixed(3)}</b> · dice_loss = <b>${(1 - dice).toFixed(3)}</b><br>
       Pixel accuracy = <b>${(acc * 100).toFixed(1)}%</b>` +
      (b === 0 ? `<br>All-background prediction: accuracy looks high, Dice is 0. That is the notebook’s failed run.` : "");
  }
  function draw() {
    gtEl.innerHTML = ""; prEl.innerHTML = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const g = document.createElement("div");
      g.className = "cell" + (gt[r][c] ? " on" : "");
      g.onclick = () => { gt[r][c] = gt[r][c] ? 0 : 1; draw(); };
      gtEl.appendChild(g);
      const p = document.createElement("div");
      p.className = "cell" + (pr[r][c] ? " on" : "");
      p.onclick = () => { pr[r][c] = pr[r][c] ? 0 : 1; draw(); };
      prEl.appendChild(p);
    }
    score();
  }
  document.getElementById("dice-empty").onclick = () => {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) pr[r][c] = 0;
    draw();
  };
  document.getElementById("dice-copy").onclick = () => {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) pr[r][c] = gt[r][c];
    draw();
  };
  draw();
}

const GLOSSARY = [
  { g: "The big picture", t: "Artificial intelligence (AI)", d: "Any technique that makes a computer act usefully on a task that used to need a person. ML is one kind of AI." },
  { g: "The big picture", t: "Machine learning (ML)", d: "Instead of writing a rule for every case, you show examples. The program adjusts numbers (weights) so it guesses better next time." },
  { g: "The big picture", t: "Deep learning (DL)", d: "ML that uses neural networks with several layers. Every notebook in this folder is deep learning." },
  { g: "The big picture", t: "Computer vision (CV)", d: "ML whose input is images (or video). What is in this picture? Where? Who? Which pixels?" },
  { g: "The big picture", t: "Supervised learning", d: "Each training example has a correct answer (a label). Diabetes yes/no, digit 0–9, tumor mask. Almost this whole course." },
  { g: "Data", t: "Feature", d: "A number the model sees. Glucose, or one pixel, or a whole learned vector (embedding)." },
  { g: "Data", t: "Label / target / y", d: "The answer you want. 0/1, class 9, or a mask image. Training compares the prediction to y." },
  { g: "Data", t: "Train / validation / test", d: "Train = fit weights. Val = peek while training. Test = one honest score at the end. Never train on test." },
  { g: "Data", t: "Batch", d: "A small group of examples in one weight update. batch_size=32 means 32 images per step." },
  { g: "Data", t: "Epoch", d: "One full pass over the training set. 10 epochs = every train image about 10 times." },
  { g: "Data", t: "Normalization", d: "Put numbers on a friendly range. Pixels /255 → 0–1. MobileNet ≈ −1 to 1." },
  { g: "Data", t: "Shape / tensor", d: "How the array is laid out, e.g. (28,28,1). A tensor is a multi-dimensional array." },
  { g: "Data", t: "Channel", d: "1 = gray, 3 = RGB. After Conv2D(32) you have 32 feature-map channels." },
  { g: "Data", t: "Class imbalance", d: "One class is rare. Accuracy looks high if you always guess the common class." },
  { g: "Neural net", t: "Neuron", d: "z = w·x + b, then an activation. One little calculator." },
  { g: "Neural net", t: "Weight", d: "A number the model learns. Training changes weights so guesses improve." },
  { g: "Neural net", t: "Bias", d: "A learned offset, like the intercept in a line." },
  { g: "Neural net", t: "Activation", d: "A curve after z. ReLU, sigmoid, softmax. Without it, stacked layers collapse to one linear map." },
  { g: "Neural net", t: "ReLU", d: "max(0, z). Default hidden activation in these notebooks." },
  { g: "Neural net", t: "Sigmoid", d: "Squishes one number to (0,1). Binary last layer." },
  { g: "Neural net", t: "Softmax", d: "K scores → K probabilities that sum to 1. Exclusive classes (10 digits, 5 flowers)." },
  { g: "Neural net", t: "Dense / MLP", d: "Every input connects to every neuron. Fine for tables; wasteful on raw photos." },
  { g: "Neural net", t: "Hidden layer", d: "Any layer that is not the input and not the final output." },
  { g: "Neural net", t: "Sequential vs Functional", d: "Sequential = a line. Functional = can branch and merge (Siamese, U-Net skips)." },
  { g: "Neural net", t: "Parameter", d: "A weight or bias training can change. model.summary() counts them." },
  { g: "Training", t: "Loss", d: "A number that says how wrong. Training’s only job is to make it smaller. Not always a percent." },
  { g: "Training", t: "Metric", d: "A score you watch (accuracy, Dice, kappa). It does not update weights unless it is also the loss." },
  { g: "Training", t: "Gradient", d: "How loss changes if you nudge a weight. Tells you which way to move it." },
  { g: "Training", t: "Backpropagation", d: "Send the error backward through the layers so every weight gets a gradient. Keras does this inside fit()." },
  { g: "Training", t: "Optimizer / Adam", d: "The rule that uses gradients to update weights. Adam is the default here." },
  { g: "Training", t: "Learning rate", d: "Step size. Too big = bouncing. Fine-tune pretrained nets with a tiny LR like 1e-5." },
  { g: "Training", t: "compile / fit / evaluate / predict", d: "Pick loss+optimizer → train → score a set → raw outputs." },
  { g: "Training", t: "Overfitting", d: "Great on train, worse on val/test. Memorized the homework, failed the exam." },
  { g: "Training", t: "Underfitting", d: "Bad on train and test. Too simple or not trained long enough." },
  { g: "Training", t: "Regularization", d: "Anything that fights overfitting: dropout, augmentation, weight decay, early stop." },
  { g: "Training", t: "Callback", d: "A hook during fit: EarlyStopping, ModelCheckpoint, ReduceLROnPlateau." },
  { g: "CNN", t: "CNN / ConvNet", d: "Convolutional Neural Network: slides small filters over a grid instead of flattening first." },
  { g: "CNN", t: "Convolution", d: "At each position, multiply overlapping pixels by the kernel and add. One number in the feature map." },
  { g: "CNN", t: "Kernel / filter", d: "The small weight grid (often 3×3) that slides. Training learns the numbers inside it." },
  { g: "CNN", t: "Feature map", d: "The 2D result of one filter. Bright where that pattern was found." },
  { g: "CNN", t: "Local connectivity", d: "A conv neuron only looks at a neighborhood. Images are local (edges, textures)." },
  { g: "CNN", t: "Weight sharing", d: "The same kernel is reused everywhere. “Vertical edge” costs 9 weights, not a new set per pixel." },
  { g: "CNN", t: "Stride", d: "How many pixels the kernel jumps. 1 = dense. 2 = skip; the map shrinks faster." },
  { g: "CNN", t: "Padding (valid / same)", d: "valid = no extra border, size shrinks. same = pad so size stays when stride is 1." },
  { g: "CNN", t: "Max pooling", d: "Downsample: keep the strongest value in each 2×2 block." },
  { g: "CNN", t: "Receptive field", d: "How much of the original image one deep number can “see.” Grows with convs and pools." },
  { g: "CNN", t: "Flatten", d: "Turn H×W into a list before Dense. Throws away the grid." },
  { g: "CNN", t: "Logits", d: "Raw class scores before softmax. PyTorch CrossEntropyLoss wants these." },
  { g: "After CNN", t: "Dropout", d: "During training, randomly turn neurons off. Off at test time." },
  { g: "After CNN", t: "BatchNorm", d: "Keeps layer outputs on a stable scale. Freeze BN stats when doing transfer learning." },
  { g: "After CNN", t: "Data augmentation", d: "Legal random warps of train images. Never augment the honest test set." },
  { g: "After CNN", t: "Transfer learning", d: "Reuse a net trained on a huge set (ImageNet) instead of training filters from scratch." },
  { g: "After CNN", t: "Feature extraction vs fine-tune", d: "Phase 1: freeze backbone, train a head. Phase 2: unfreeze upper layers with a tiny LR." },
  { g: "After CNN", t: "include_top=False", d: "Drop ImageNet’s 1000-class head. Keep visual features; add your classes." },
  { g: "After CNN", t: "Grad-CAM", d: "Heatmap of which pixels drove a class score. Explains a classifier; not a trained mask." },
  { g: "After CNN", t: "Embedding", d: "A vector that stands for an image or a sentence. Nearby = similar." },
  { g: "After CNN", t: "Siamese / contrastive / cosine", d: "Two shared towers, pull same identities close, match with cosine distance. Not softmax over names." },
  { g: "After CNN", t: "Detection vs recognition", d: "Detection = find a box (SSD). Recognition = who is inside (ArcFace)." },
  { g: "After CNN", t: "Segmentation / mask / U-Net / Dice", d: "A class for every pixel. U-Net draws the map. Dice scores overlap — accuracy will lie on tiny tumors." },
  { g: "After CNN", t: "Quadratic weighted kappa", d: "Agreement that punishes far-off ordinal mistakes more. Eye-disease metric." },
  { g: "After CNN", t: "One-hot", d: "Class 6 → a 10-long vector with a 1 in slot 6. Used with categorical_crossentropy." },
  { g: "After CNN", t: "ArcFace / ONNX", d: "A pretrained face embedding (512-D). ONNX runs it without TensorFlow. Attendance notebook." },
  { g: "After CNN", t: "MobileNetV2 / ImageNet", d: "A small CNN pretrained on ImageNet’s 1000 classes. Flowers transfer-learning backbone." }
];

function renderGlossary(filter) {
  const root = document.getElementById("glossary-root");
  if (!root) return;
  const q = (filter || "").trim().toLowerCase();
  const groups = [];
  GLOSSARY.forEach(item => {
    const hay = (item.t + " " + item.d).toLowerCase();
    if (q && !hay.includes(q)) return;
    let g = groups.find(x => x.name === item.g);
    if (!g) { g = { name: item.g, items: [] }; groups.push(g); }
    g.items.push(item);
  });
  const n = groups.reduce((s, g) => s + g.items.length, 0);
  root.innerHTML = `<div class="g-count">${n} word${n === 1 ? "" : "s"}</div>` + (groups.map(g => `
    <div class="g-group">
      <h3>${g.name}</h3>
      ${g.items.map(item => `<div class="g-item"><dt>${item.t}</dt><dd>${item.d}</dd></div>`).join("")}
    </div>
  `).join("") || `<p>No match. Try cnn, loss, or mask.</p>`);
}

function initGlossary() {
  const inp = document.getElementById("glossary-search");
  renderGlossary("");
  if (inp) inp.addEventListener("input", () => renderGlossary(inp.value));
}

function initTheme() {
  const btn = document.getElementById("theme-btn");
  const apply = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cv-theme", t);
    if (btn) btn.textContent = t === "dark" ? "Light mode" : "Dark mode";
  };
  let t = localStorage.getItem("cv-theme");
  if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  apply(t);
  if (btn) btn.addEventListener("click", () => {
    apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

function initNorm() {
  const box = document.getElementById("lab-norm");
  if (!box) return;
  box.innerHTML = `
    <p>Pixel 200 / 255. Networks learn faster when values sit near 0–1 (or −1 to 1 for MobileNet).</p>
    <label>Pixel value (0–255): <span id="nv">200</span></label>
    <input type="range" id="pix" min="0" max="255" value="200">
    <div class="out" id="n-out"></div>
    <div id="n-swatch" style="height:42px;border-radius:8px;border:1px solid var(--line);margin-top:0.5rem"></div>
  `;
  const upd = () => {
    const p = Number(document.getElementById("pix").value);
    document.getElementById("nv").textContent = p;
    const n1 = p / 255;
    const n2 = (p - 127.5) / 128;
    document.getElementById("n-out").innerHTML =
      `MNIST / Fashion-MNIST: ${p} / 255 = <b>${n1.toFixed(3)}</b><br>
       ArcFace preprocess: (${p} − 127.5) / 128 = <b>${n2.toFixed(3)}</b><br>
       MobileNetV2 <code>preprocess_input</code> also maps roughly to [−1, 1].`;
    document.getElementById("n-swatch").style.background = `rgb(${p},${p},${p})`;
  };
  box.addEventListener("input", upd);
  upd();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initGlossary();
  renderQuizzes();
  initNeuron();
  initOneHot();
  initSoftmax();
  initConv();
  initPool();
  initStride();
  initDropout();
  initContrastive();
  initCosine();
  initNorm();
  initLossPicker();
  initDice();
  const menu = document.getElementById("menu-btn");
  const side = document.querySelector(".sidebar");
  if (menu && side) {
    if (window.matchMedia("(max-width: 920px)").matches) side.classList.add("collapsed");
    menu.addEventListener("click", () => side.classList.toggle("collapsed"));
  }
  const id = location.hash.replace("#", "") || "home";
  show(PAGES.includes(id) ? id : "home");
});
