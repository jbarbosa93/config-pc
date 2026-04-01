import Link from "next/link";

export default function MentionsLegales() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-text-secondary hover:text-text transition-colors duration-150 mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>

      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

      <div className="prose prose-sm max-w-none text-text space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Éditeur du site</h2>
          <p className="text-text-secondary leading-relaxed">
            Le site www.config-pc.ch est édité par config-pc.ch.<br />
            Siège social : Monthey, Valais, Suisse<br />
            Numéro IDE : En cours d&apos;enregistrement<br />
            Contact : j.barbosa@config-pc.ch
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Hébergement</h2>
          <p className="text-text-secondary leading-relaxed">
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
          <p className="text-text-secondary leading-relaxed">
            L&apos;ensemble du contenu du site (textes, graphismes, logos, icônes, images, logiciels) est la propriété
            exclusive de config-pc.ch ou de ses partenaires et est protégé par les lois suisses et internationales
            relatives à la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation,
            totale ou partielle, est interdite sans autorisation préalable écrite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Liens d&apos;affiliation</h2>
          <p className="text-text-secondary leading-relaxed">
            config-pc.ch peut contenir des liens vers des sites marchands tiers suisses (Digitec, Galaxus, Interdiscount, Brack, Microspot, etc.).
            Certains de ces liens peuvent être des liens d&apos;affiliation, ce qui signifie que config-pc.ch peut percevoir
            une commission sur les ventes réalisées via ces liens, sans coût supplémentaire pour l&apos;utilisateur.
            Les recommandations de composants sont générées par intelligence artificielle et ne constituent pas des conseils
            d&apos;achat personnalisés au sens de la loi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Limitation de responsabilité</h2>
          <p className="text-text-secondary leading-relaxed">
            Les prix affichés sur config-pc.ch sont indicatifs et générés par intelligence artificielle. Ils peuvent différer
            des prix réels pratiqués par les marchands. config-pc.ch ne saurait être tenu responsable des écarts de prix,
            des ruptures de stock, des incompatibilités matérielles ou de tout dommage résultant de l&apos;utilisation
            des recommandations fournies. L&apos;utilisateur est invité à vérifier les prix et la compatibilité des composants
            directement auprès des revendeurs avant tout achat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Droit applicable</h2>
          <p className="text-text-secondary leading-relaxed">
            Les présentes mentions légales sont régies par le droit suisse. Tout litige relatif à l&apos;utilisation du site
            sera soumis à la compétence exclusive des tribunaux du canton du Valais, Suisse.
          </p>
        </section>

        <p className="text-text-secondary text-xs pt-4 border-t border-border">
          Dernière mise à jour : 1er avril 2026
        </p>
      </div>
    </main>
  );
}
