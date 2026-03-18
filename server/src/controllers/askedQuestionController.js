const AskedQuestion = require('../models/AskedQuestion');
const nodemailer = require('nodemailer');

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

// @desc    Create asked question from public form
// @route   POST /api/asked-questions
// @access  Public
const createAskedQuestion = async (req, res) => {
    try {
        const { fullName, email, category, preferredLanguage, question, consent } = req.body;

        if (!fullName || !email || !category || !question || consent !== true) {
            return res.status(400).json({ message: 'Please provide all required fields and consent.' });
        }

        const askedQuestion = await AskedQuestion.create({
            fullName,
            email,
            category,
            preferredLanguage: preferredLanguage || 'en',
            question,
            consent: true,
        });

        const smtpHost = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
        const smtpPort = Number(process.env.ZOHO_SMTP_PORT || 465);
        const smtpSecure = String(process.env.ZOHO_SMTP_SECURE || 'true').toLowerCase() === 'true';
        const smtpUser = process.env.ZOHO_EMAIL_USER;
        const smtpPass = process.env.ZOHO_EMAIL_PASS;
        const fromEmail = process.env.ZOHO_EMAIL_FROM || smtpUser;
        const fromName = process.env.ZOHO_EMAIL_FROM_NAME || 'AskYourMufti Support';
        const notifyEmail =
            process.env.ZOHO_NOTIFY_EMAIL ||
            process.env.ADMIN_NOTIFICATION_EMAIL ||
            process.env.ZOHO_EMAIL_USER;

        if (smtpUser && smtpPass && fromEmail && notifyEmail) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpSecure,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass,
                    },
                });

                const askedDate = new Date(askedQuestion.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                });
                const safeName = escapeHtml(askedQuestion.fullName);
                const safeEmail = escapeHtml(askedQuestion.email);
                const safeCategory = escapeHtml(askedQuestion.category);
                const safeLanguage = escapeHtml(askedQuestion.preferredLanguage || 'en');
                const safeQuestion = escapeHtml(askedQuestion.question).replace(/\n/g, '<br/>');
                const adminPanelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/islamic-admin/asked-questions`;
                const sanitizedNotifyEmail = String(notifyEmail).trim();
                const notificationMail = {
                    from: `"${fromName}" <${fromEmail}>`,
                    to: sanitizedNotifyEmail,
                    subject: `New question received - ${askedQuestion.category}`,
                    text: `A new question has been submitted on AskYourMufti.

Name: ${askedQuestion.fullName}
Email: ${askedQuestion.email}
Category: ${askedQuestion.category}
Preferred language: ${askedQuestion.preferredLanguage || 'en'}
Submitted on: ${askedDate}

Question:
${askedQuestion.question}

Open admin panel:
${adminPanelUrl}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; background: #f7f7f5; padding: 24px; color: #1f2937;">
                            <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                                <div style="background: #064e3b; color: #ffffff; padding: 16px 20px;">
                                    <h2 style="margin: 0; font-size: 18px;">New Asked Question</h2>
                                </div>
                                <div style="padding: 20px;">
                                    <p style="margin-top: 0;">A new question has been submitted on AskYourMufti.</p>
                                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${safeName}</p>
                                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                                    <p style="margin: 0 0 10px 0;"><strong>Category:</strong> ${safeCategory}</p>
                                    <p style="margin: 0 0 10px 0;"><strong>Preferred Language:</strong> ${safeLanguage}</p>
                                    <p style="margin: 0 0 14px 0;"><strong>Submitted on:</strong> ${escapeHtml(askedDate)}</p>

                                    <div style="margin: 10px 0 20px 0; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; background: #fffbeb;">
                                        <p style="margin: 0 0 8px 0; font-weight: 700; color: #92400e;">Question</p>
                                        <p style="margin: 0; line-height: 1.6;">${safeQuestion}</p>
                                    </div>

                                    <a href="${adminPanelUrl}" style="display: inline-block; background: #064e3b; color: #ffffff; text-decoration: none; padding: 10px 14px; border-radius: 8px; font-weight: 600;">Open Admin Panel</a>
                                </div>
                            </div>
                        </div>
                    `,
                    headers: {
                        'X-Entity-Ref-ID': `${askedQuestion._id}`,
                    },
                };

                if (isValidEmail(askedQuestion.email)) {
                    notificationMail.replyTo = askedQuestion.email;
                }

                let mailInfo;
                try {
                    mailInfo = await transporter.sendMail(notificationMail);
                } catch (sendError) {
                    if (notificationMail.replyTo) {
                        console.warn(
                            `Asked question notification retrying without replyTo for ${askedQuestion._id}:`,
                            sendError.message
                        );
                        delete notificationMail.replyTo;
                        mailInfo = await transporter.sendMail(notificationMail);
                    } else {
                        throw sendError;
                    }
                }

                console.log(
                    `Asked question notification sent for ${askedQuestion._id} to ${sanitizedNotifyEmail}. MessageId: ${mailInfo.messageId}`
                );
            } catch (notifyError) {
                console.error(
                    `Failed to send admin notification for asked question ${askedQuestion._id}:`,
                    notifyError.message
                );
            }
        } else {
            console.warn(
                `Asked question notification skipped for ${askedQuestion._id}. Missing SMTP config or notify email.`
            );
        }

        res.status(201).json({
            message: 'Question submitted successfully.',
            id: askedQuestion._id,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all asked questions for admin
// @route   GET /api/asked-questions
// @access  Admin
const getAskedQuestions = async (req, res) => {
    try {
        const askedQuestions = await AskedQuestion.find({}).sort({ createdAt: -1 });
        res.json(askedQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send answer email to questioner and store admin answer
// @route   POST /api/asked-questions/:id/answer
// @access  Admin
const answerAskedQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return res.status(400).json({ message: 'Answer is required.' });
        }

        const askedQuestion = await AskedQuestion.findById(id);
        if (!askedQuestion) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        const smtpHost = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
        const smtpPort = Number(process.env.ZOHO_SMTP_PORT || 465);
        const smtpSecure = String(process.env.ZOHO_SMTP_SECURE || 'true').toLowerCase() === 'true';
        const smtpUser = process.env.ZOHO_EMAIL_USER;
        const smtpPass = process.env.ZOHO_EMAIL_PASS;
        const fromEmail = process.env.ZOHO_EMAIL_FROM || smtpUser;
        const fromName = process.env.ZOHO_EMAIL_FROM_NAME || 'AskYourMufti Support';

        if (!smtpUser || !smtpPass || !fromEmail) {
            return res.status(500).json({
                message: 'Zoho SMTP is not configured. Set ZOHO_EMAIL_USER, ZOHO_EMAIL_PASS, and optionally ZOHO_EMAIL_FROM.',
            });
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const subject = `Answer to your question - ${askedQuestion.category}`;
        const sanitizedAnswer = answer.trim();
        const safeName = escapeHtml(askedQuestion.fullName);
        const safeQuestion = escapeHtml(askedQuestion.question);
        const safeAnswer = escapeHtml(sanitizedAnswer).replace(/\n/g, '<br/>');
        const askedDate = new Date(askedQuestion.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: askedQuestion.email,
            replyTo: fromEmail,
            subject,
            text: `Assalamu Alaikum ${askedQuestion.fullName},

We received your question and here is the answer from our team.

Your question:
${askedQuestion.question}

Answer:
${sanitizedAnswer}

Category: ${askedQuestion.category}
Asked on: ${askedDate}

JazakAllahu Khairan,
AskYourMufti`,
            html: `
                <div style="font-family: Arial, sans-serif; background: #f7f7f5; padding: 24px; color: #1f2937;">
                    <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                        <div style="background: #064e3b; color: #ffffff; padding: 16px 20px;">
                            <h2 style="margin: 0; font-size: 18px;">AskYourMufti - Question Response</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p style="margin-top: 0;">Assalamu Alaikum ${safeName},</p>
                            <p>We received your question and here is the answer from our team.</p>

                            <div style="margin: 18px 0; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; background: #fffbeb;">
                                <p style="margin: 0 0 8px 0; font-weight: 700; color: #92400e;">Your Question</p>
                                <p style="margin: 0; line-height: 1.6;">${safeQuestion}</p>
                            </div>

                            <div style="margin: 18px 0; border: 1px solid #d1fae5; border-radius: 10px; padding: 14px; background: #ecfdf5;">
                                <p style="margin: 0 0 8px 0; font-weight: 700; color: #065f46;">Answer</p>
                                <p style="margin: 0; line-height: 1.6;">${safeAnswer}</p>
                            </div>

                            <p style="margin: 10px 0 0 0; font-size: 13px; color: #6b7280;">Category: ${escapeHtml(askedQuestion.category)}<br/>Asked on: ${escapeHtml(askedDate)}</p>
                            <p style="margin-top: 20px;">JazakAllahu Khairan,<br/>AskYourMufti Team</p>
                        </div>
                    </div>
                </div>
            `,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'X-Entity-Ref-ID': `${askedQuestion._id}`,
            },
        });

        askedQuestion.adminAnswer = sanitizedAnswer;
        askedQuestion.answeredAt = new Date();
        askedQuestion.status = 'reviewed';
        await askedQuestion.save();

        return res.json({ message: 'Answer email sent successfully.' });
    } catch (error) {
        console.error('Failed to send asked question answer email:', error);
        return res.status(500).json({ message: 'Failed to send answer email.' });
    }
};

module.exports = {
    createAskedQuestion,
    getAskedQuestions,
    answerAskedQuestion,
};
