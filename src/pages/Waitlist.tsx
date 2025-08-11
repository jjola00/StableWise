import { Helmet } from "react-helmet-async";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, useRef } from "react";

export const Waitlist = () => {
  const url = useMemo(() =>
    typeof window !== 'undefined' ? window.location.origin + '/waitlist' : 'https://stablewise.app/waitlist', []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    const canvas = document.querySelector('#waitlist-qr canvas') as HTMLCanvasElement | null;
    const link = document.createElement('a');
    link.download = 'stablewise-waitlist-qr.png';
    link.href = canvas ? canvas.toDataURL('image/png') : '';
    link.click();
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Join StableWise Waitlist – Get €100 Credits</title>
        <meta name="description" content="Be first. Get rewarded. Join the StableWise waitlist now and receive €100 credits at launch. Limited early offer." />
        <link rel="canonical" href={url} />
      </Helmet>

      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Be First. Get Rewarded.</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Join the StableWise waitlist now and get €100 worth of credits at launch.
              Limited offer – only for early signups.
            </p>
            <Card>
              <CardContent className="p-6">
                <WaitlistForm />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold">Share or Download QR</h2>
                <div id="waitlist-qr" className="p-4 bg-card border rounded-lg">
                  <QRCodeCanvas value={url} size={224} includeMargin={true} />
                </div>
                <Button variant="outline" onClick={handleDownload}>Download QR Code</Button>
                <p className="text-sm text-muted-foreground text-center">
                  Use this at events, in stories, or on slides to send people directly to the waitlist.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};
