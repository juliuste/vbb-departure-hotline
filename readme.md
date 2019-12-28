# vbb-departure-hotline

Get information about VBB (Berlin/Brandenburg public transport) departures via telephone. Exposes a rest API which can be used to create a [twilio](https://www.twilio.com/docs/voice) voice service (see also [twilio integration](#twilio-integration)). __*Please note that the service responds in german.*__

__You can test the hotline yourself by calling *[+49 30 255 585 775](tel:+4930255585775)*. Please note that this is not a production endpoint, it may be rate-limited or even shut down completely at any point in time, so don't rely on it, just use it for testing purposes.__

[![license](https://img.shields.io/github/license/juliuste/vbb-departure-hotline.svg?style=flat)](license)

## Example conversation

> Herzlich Willkommen bei der VBB-Abfahrtshotline!
>
> Bitte suchen Sie nach einer Station mit Hilfe der Buchstaben auf ihrer Telefontastatur. Wählen sie zum Beispiel 9, 6, 6 für Z, O, O. Für Leerzeichen benutzen Sie bitte die 0.

__*23553883*__ *(Bellevue)*

> Bitte wählen Sie:
>
> Für Bellevue die 1,
>
> für Schloss Bellevue die 2,
>
> …
>
> Oder drücken Sie die Rautetaste, um nach einer anderen Station zu suchen.
>
> Um diese Ansage zu wiederholen, drücken Sie bitte die Sterntaste.

__*1*__

> Nächste Abfahrten für Bellevue:
>
> S-Bahn S5 Richtung Westkreuz, Abfahrt heute: 12:47 Uhr, kommt pünktlich.
>
> S-Bahn S7 Richtung Potsdam Hbf, ursprüngliche Abfahrtszeit: 12:52 Uhr, fällt heute leider aus.
>
> S-Bahn S3 Richtung Erkner, Abfahrt heute: 12:53 Uhr, 2 Minuten verspätet.
>
> …

## Twilio integration

You need to configure your twilio phone number's voice section to *Webhook* and add `https://your.domain/greeting` with **HTTP GET** as the webhook for incoming calls.

## See also

- **[vbb-stations-t9](https://github.com/juliuste/vbb-stations-t9)** - T9 search (search via telephone keyboard) for VBB public transport stations.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/vbb-departure-hotline/issues).
