let currentTemplateIndex = 0;

document.getElementById("cover-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  currentTemplateIndex = 0; // Reset to first template on new generation
  await generateCoverLetter();
});

async function generateCoverLetter(templateIndex) {
  const form = document.getElementById("cover-form");
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    job: document.getElementById("job").value,
    company: document.getElementById("company").value,
    jobDescription: document.getElementById("jobDescription").value,
    skills: document.getElementById("skills").value,
    templateIndex: templateIndex !== undefined ? templateIndex : currentTemplateIndex
  };

  if (!formData.name || !formData.job || !formData.company) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Generating... <span class="loading-dots"></span>';

    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok && data.coverLetter) {
      document.getElementById("result").innerHTML = formatLetter(data.coverLetter);

      const downloadBtn = document.getElementById("downloadBtn");
      downloadBtn.style.display = "block";
      downloadBtn.onclick = () => downloadLetter(data.coverLetter, formData.job);

      updateAnotherVersionButton(data.templateIndex, data.totalTemplates);
      currentTemplateIndex = (data.templateIndex + 1) % data.totalTemplates;
    } else {
      document.getElementById("result").textContent = data.error || "Error generating letter";
    }
  } catch (error) {
    document.getElementById("result").textContent = "Connection error. Please try again.";
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Generate Cover Letter';
  }
}

function updateAnotherVersionButton(currentIndex, totalTemplates) {
  let btn = document.getElementById("anotherVersionBtn");
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'anotherVersionBtn';
    btn.className = 'another-version-btn';
    document.querySelector('.container').appendChild(btn);
  }
  btn.textContent = `Generate Another Version (${currentIndex + 1}/${totalTemplates})`;
  btn.onclick = () => generateCoverLetter(currentTemplateIndex);
}

function formatLetter(text) {
  return text.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
}

function downloadLetter(content, jobTitle) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cover_letter_${jobTitle.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}