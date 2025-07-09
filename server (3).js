const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const CONFIG = {
  USE_AI: true,
  AI_MODEL: "gpt-4-turbo-preview",
  FALLBACK_TO_MOCK: true,
};

// All 15 Cover Letter Templates
const TEMPLATES = [
  // Template 1
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I am writing to apply for the [Job Title] position at [Company Name]. With a strong background in [Field/Industry] and proven experience in [Key Skills], I am confident in my ability to contribute to your team.

At [Previous Company], I [describe a key accomplishment or responsibility]. This experience helped me develop my strengths in [related skill], which I know aligns with your goals at [Company Name].

I am particularly impressed by [something about the company], and I look forward to the opportunity to support your mission while continuing to grow professionally.

Sincerely,
[Your Name]`,

  // Template 2
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I'm excited to apply for the [Job Title] role at [Company Name]. My experience in [Field/Industry] and strengths in [Skill 1], [Skill 2], and [Skill 3] have prepared me well for this opportunity.

While working at [Previous Company], I [describe a key achievement or task]. This taught me how to [mention a strength], which I'm eager to bring to your team.

I admire your work in [Company mission/project], and I'd be proud to contribute to your ongoing success.

Sincerely,
[Your Name]`,

  // Template 3
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I am reaching out to express my interest in the [Job Title] position at [Company Name]. With a passion for [Industry/Topic] and skills in [Key Skills], I am confident in my ability to support your team's objectives.

At [Previous Company], I was responsible for [task or accomplishment], which taught me how to [important skill or trait]. This experience makes me eager to contribute at [Company Name].

Your reputation for [company quality, culture, or impact] is inspiring, and I would love to be a part of that mission.

Sincerely,
[Your Name]`,

  // Template 4
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

Please accept this letter as my formal application for the [Job Title] role at [Company Name]. I bring hands-on experience in [Skill/Industry] and a strong desire to contribute to meaningful work.

In my previous position at [Previous Company], I [mention achievement or responsibility], which helped me build expertise in [related area]. I believe this experience would allow me to thrive in your fast-paced environment.

Thank you for considering my application. I look forward to learning more about the position.

Sincerely,
[Your Name]`,

  // Template 5
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

As a professional with experience in [Field/Role], I'm enthusiastic about the opportunity to apply for the [Job Title] at [Company Name]. I have a strong track record in [Skill/Project], which I'd love to bring to your organization.

My time at [Previous Company] allowed me to [achievement], and I've continued to build on those skills. I'm particularly drawn to [Company Name] because of your commitment to [Company Value or Focus].

I hope to contribute to your team's continued growth and success.

Sincerely,
[Your Name]`,

  // Template 6
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I am thrilled to apply for the [Job Title] position at [Company Name]. With a background in [Field/Industry] and a passion for delivering results, I believe I would make a valuable addition to your team.

At [Previous Company], I successfully [mention key responsibility or achievement], allowing me to strengthen my skills in [mention a skill]. I take pride in my ability to adapt quickly and solve complex problems under pressure.

I admire [Company Name]'s work in [specific area], and I look forward to the opportunity to contribute.

Sincerely,
[Your Name]`,

  // Template 7
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I am applying for the [Job Title] position at [Company Name], drawn by your mission to [mention something specific about the company]. With professional experience in [Field/Industry], I bring both technical and interpersonal skills to the table.

In my role at [Previous Company], I [describe a project or responsibility]. That experience gave me strong foundations in [Skill], which I believe align well with your team's goals.

Thank you for considering my application. I would welcome the opportunity to discuss it further.

Sincerely,
[Your Name]`,

  // Template 8
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I'm excited to submit my application for the [Job Title] opening at [Company Name]. My experience in [Field] and dedication to [Company Value or Principle] make this a compelling opportunity.

I have worked on [mention a relevant project], which improved [outcome or result]. I am particularly skilled in [Skill], and I'm ready to apply this experience at [Company Name].

Thank you for your time and consideration.

Sincerely,
[Your Name]`,

  // Template 9
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

Please accept my application for the [Job Title] role at [Company Name]. I am confident that my experience in [Field] and my proficiency in [Tool or Skill] make me a strong candidate for this position.

Previously at [Previous Company], I [explain a relevant task or success], and I am eager to bring that same commitment and innovation to your organization.

I look forward to the possibility of contributing to your success.

Sincerely,
[Your Name]`,

  // Template 10
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

It is with enthusiasm that I apply for the [Job Title] at [Company Name]. My career in [Industry] has given me deep insight into [relevant expertise], and I'm eager to bring that to your team.

Working at [Previous Company] allowed me to [achievement or initiative], reinforcing my strengths in [Skill] and collaboration.

I'd be honored to contribute to your ongoing innovation.

Sincerely,
[Your Name]`,

  // Template 11
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I am writing to express my keen interest in the [Job Title] opportunity at [Company Name]. With strong skills in [Skill 1], [Skill 2], and [Skill 3], I am confident in my ability to contribute effectively to your team.

At [Previous Company], I played a key role in [mention task or responsibility]. This taught me how to be both resourceful and results-driven.

Thank you for considering my application.

Sincerely,
[Your Name]`,

  // Template 12
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I was excited to see the opening for a [Job Title] at [Company Name]. With hands-on experience in [Industry/Field], I feel ready to bring value to your growing team.

In my past role at [Previous Company], I was responsible for [describe task or challenge], and this helped me develop skills in [Skill]. I would love the chance to put those to work in a new environment.

Thank you for your consideration.

Sincerely,
[Your Name]`,

  // Template 13
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I'm thrilled to apply for the [Job Title] at [Company Name]. I'm particularly drawn to your work in [mention something specific about the company or field], and I believe my skills in [Skill 1] and [Skill 2] are a great fit.

At [Previous Company], I led a project that [describe outcome], which taught me how to [describe lesson or skill]. I'd be excited to apply this experience at [Company Name].

I look forward to the opportunity to speak further.

Sincerely,
[Your Name]`,

  // Template 14
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

Please consider this letter my formal application for the [Job Title] role at [Company Name]. I bring experience in [Industry or Role] and am eager to apply my knowledge in a new and challenging environment.

While at [Previous Company], I [mention achievement or task]. This role sharpened my skills in [Skill] and taught me to thrive under pressure.

I'm excited about the possibility of joining your team.

Sincerely,
[Your Name]`,

  // Template 15
  `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Hiring Manager's Name],

I'm applying for the [Job Title] at [Company Name] because I see a perfect alignment between your needs and my experience in [Field/Skill]. I'm eager to join an organization where innovation and teamwork are valued.

At [Previous Company], I successfully [describe accomplishment or responsibility], and I'm confident I can bring similar impact to your team.

Thank you for your time and consideration.

Sincerely,
[Your Name]`
];

app.post("/generate", async (req, res) => {
  const { name, email, phone, job, company, jobDescription, skills, templateIndex = 0 } = req.body;

  try {
    let result;
    if (CONFIG.USE_AI && openai) {
      result = await generateAICoverLetter(
        name,
        email,
        phone,
        job,
        company,
        jobDescription,
        skills,
        templateIndex
      );
    } else {
      result = generateTemplateLetter(
        name,
        email,
        phone,
        job,
        company,
        skills,
        templateIndex
      );
    }
    res.json(result);
  } catch (error) {
    console.error("Generation Error:", error);
    if (CONFIG.FALLBACK_TO_MOCK) {
      res.json(generateTemplateLetter(
        name,
        email,
        phone,
        job,
        company,
        skills,
        templateIndex
      ));
    } else {
      res.status(500).json({
        error: "Failed to generate cover letter",
        details: CONFIG.DEBUG ? error.message : undefined,
      });
    }
  }
});

async function generateAICoverLetter(
  name,
  email,
  phone,
  job,
  company,
  jobDescription,
  skills,
  templateIndex
) {
  const selectedTemplate = TEMPLATES[templateIndex % TEMPLATES.length];

  const prompt = `Using this template structure, generate a professional cover letter for ${name} applying to ${job} at ${company}:

Template to follow:
${selectedTemplate}

Requirements:
1. Fill all placeholders with appropriate content
2. Reference these skills: ${skills}
3. Incorporate relevant details from: ${jobDescription}
4. Maintain professional tone and business format
5. Keep length between 250-400 words`;

  const completion = await openai.chat.completions.create({
    model: CONFIG.AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1500,
  });

  const rawLetter = completion.choices[0].message.content;
  const validatedLetter = await validateProfessionalism(rawLetter);

  return {
    coverLetter: validatedLetter,
    source: "ai",
    templateIndex: templateIndex % TEMPLATES.length,
    totalTemplates: TEMPLATES.length
  };
}

function generateTemplateLetter(
  name,
  email,
  phone,
  job,
  company,
  skills,
  templateIndex
) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const selectedTemplate = TEMPLATES[templateIndex % TEMPLATES.length];

  let letter = selectedTemplate
    .replace(/\[Your Name\]/g, name)
    .replace(/\[Your Email Address\]/g, email)
    .replace(/\[Your Phone Number\]/g, phone)
    .replace(/\[Job Title\]/g, job)
    .replace(/\[Company Name\]/g, company)
    .replace(/\[Date\]/g, today)
    .replace(/\[Field\/Industry\]/g, skills.split(",")[0] || "relevant field")
    .replace(/\[Key Skills\]/g, skills.split(",").slice(0, 3).join(", ") || "key skills")
    .replace(/\[Previous Company\]/g, "my previous organization")
    .replace(/\[Skill 1\]/g, skills.split(",")[0] || "relevant skill")
    .replace(/\[Skill 2\]/g, skills.split(",")[1] || "relevant skill")
    .replace(/\[Skill 3\]/g, skills.split(",")[2] || "relevant skill");

  return {
    coverLetter: letter,
    source: "template",
    templateIndex: templateIndex % TEMPLATES.length,
    totalTemplates: TEMPLATES.length
  };
}

async function validateProfessionalism(text) {
  const validation = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Verify this cover letter's professionalism (1-10) and return it verbatim if score >8, otherwise improve it:\n${text}`,
      },
    ],
    temperature: 0.3,
  });

  return validation.choices[0].message.content;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));