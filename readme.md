# vbb-departure-hotline

Get information about VBB (Berlin/Brandenburg public transport) departures via telephone. Exposes a rest API which can be used to create a [twilio](https://www.twilio.com/docs/voice) voice service. __*Please note that the bot responds in german.*__

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

---

__You can test the bot yourself by calling *[+49 1573 5999765](tel:+4915735999765)*. Please note that this is not a production endpoint, it may be rate-limited or even shut down completely at any point in time, so don't rely on it, just use it for testing purposes.__

[![license](https://img.shields.io/github/license/juliuste/vbb-departure-hotline.svg?style=flat)](license)

## See also

- **[vbb-stations-t9](https://github.com/juliuste/vbb-stations-t9)** - T9 search (search via telephone keyboard) for VBB public transport stations.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/vbb-departure-hotline/issues).
