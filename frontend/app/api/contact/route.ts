import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Contact Form API Called ===');
    
    const { name, email, phone, subject, message } = await request.json();
    console.log('Received data:', { name, email, phone, subject, message: message?.substring(0, 50) + '...' });

    // Check environment variables
    console.log('GMAIL_EMAIL exists:', !!process.env.GMAIL_EMAIL);
    console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Gmail credentials not configured');
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please contact the administrator.',
          details: 'Gmail credentials are missing'
        },
        { status: 500 }
      );
    }

    console.log('Creating Gmail transporter...');
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Test the transporter connection
    try {
      await transporter.verify();
      console.log('Gmail transporter verified successfully');
    } catch (verifyError: any) {
      console.error('Gmail transporter verification failed:', verifyError);
      return NextResponse.json(
        { 
          error: 'Email service configuration error',
          details: verifyError?.message || 'Unknown verification error'
        },
        { status: 500 }
      );
    }

    // Email to you (the business owner)
    const emailToOwner = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL, // Your email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f97316; color: white; text-align: center; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">FreudeDev Contact Form</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Efficient digital services for your business growth</p>
          </div>
        </div>
      `,
    };

    // Confirmation email to the user
    const emailToUser = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Thank you for contacting FreudeDev',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">FreudeDev</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Efficient digital services for your business growth</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <h2 style="color: #333; margin-top: 0;">Thank You for Contacting Us!</h2>
            <p style="color: #666; line-height: 1.6;">
              We've received your message and will get back to you within 24 hours. 
              Our team is excited to help with your digital needs.
            </p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; color: #555; background: #f8f9fa; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 20px;">Need immediate assistance?</p>
            <a href="https://wa.me/237650812141" 
               style="background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Chat on WhatsApp
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f97310; color: white; text-align: center; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">FreudeDev</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Web Design • IT Solutions • Network Administration</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    console.log('Sending email to owner...');
    await transporter.sendMail(emailToOwner);
    console.log('Owner email sent successfully');

    console.log('Sending confirmation email to user...');
    await transporter.sendMail(emailToUser);
    console.log('User confirmation email sent successfully');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('=== Contact Form Error ===');
    console.error('Error type:', error?.constructor?.name || 'Unknown');
    console.error('Error message:', error?.message || 'Unknown error');
    console.error('Error stack:', error?.stack || 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message || 'Unknown error',
          type: error?.constructor?.name || 'Unknown',
          stack: error?.stack || 'No stack trace'
        } : undefined
      },
      { status: 500 }
    );
  }
}
