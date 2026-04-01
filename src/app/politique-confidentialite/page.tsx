import Link from "next/link";

export default function PolitiqueConfidentialite() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-text-secondary hover:text-text transition-colors duration-150 mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>

      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

      <div className="prose prose-sm max-w-none text-text space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-text-secondary leading-relaxed">
            ConfigPC.ch (&quot;nous&quot;, &quot;notre&quot;) s&apos;engage à protéger la vie privée de ses utilisateurs.
            La présente politique de confidentialité décrit les données que nous collectons, comment nous les utilisons
            et les droits dont vous disposez. Elle est conforme au Règlement général sur la protection des données (RGPD)
            de l&apos;Union européenne et à la Loi fédérale suisse sur la protection des données (nLPD, entrée en vigueur
            le 1er septembre 2023).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Responsable du traitement</h2>
          <p className="text-text-secondary leading-relaxed">
            ConfigPC.ch<br />
            Vaud, Suisse<br />
            Contact : privacy@configpc.ch
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Données collectées</h2>
          <p className="text-text-secondary leading-relaxed">
            <strong>Données de configuration :</strong> Les choix que vous effectuez dans le configurateur (usage, budget,
            résolution, marché) sont transmis à notre serveur pour générer une recommandation. Ces données ne sont pas
            associées à votre identité et ne sont pas conservées après la génération de la configuration.<br /><br />
            <strong>Données techniques :</strong> Nous pouvons collecter des données techniques anonymes (type de navigateur,
            système d&apos;exploitation, résolution d&apos;écran) à des fins d&apos;amélioration du service.<br /><br />
            <strong>Préférences locales :</strong> Votre choix de langue est sauvegardé dans le stockage local de votre
            navigateur (localStorage). Cette donnée n&apos;est jamais transmise à nos serveurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Utilisation des données</h2>
          <p className="text-text-secondary leading-relaxed">
            Vos données sont utilisées exclusivement pour :<br />
            — Générer des recommandations de configuration PC personnalisées<br />
            — Améliorer la qualité du service et l&apos;expérience utilisateur<br />
            — Établir des statistiques anonymes d&apos;utilisation
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Sous-traitants et transferts de données</h2>
          <p className="text-text-secondary leading-relaxed">
            Les données de configuration sont traitées par Anthropic PBC (San Francisco, États-Unis) via l&apos;API Claude
            pour la génération des recommandations. Ce transfert est encadré par des clauses contractuelles types (CCT)
            conformes au RGPD. Anthropic ne conserve pas les données de requêtes API au-delà du traitement immédiat.
            Le site est hébergé par Vercel Inc. (États-Unis), également encadré par des CCT.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
          <p className="text-text-secondary leading-relaxed">
            ConfigPC.ch n&apos;utilise pas de cookies de suivi ou de cookies publicitaires. Seules des données de stockage
            local (localStorage) sont utilisées pour sauvegarder vos préférences de langue. Aucun cookie tiers n&apos;est
            déposé sur votre appareil.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Vos droits</h2>
          <p className="text-text-secondary leading-relaxed">
            Conformément au RGPD et à la nLPD, vous disposez des droits suivants :<br />
            — <strong>Droit d&apos;accès :</strong> obtenir une copie des données personnelles que nous détenons<br />
            — <strong>Droit de rectification :</strong> corriger des données inexactes<br />
            — <strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données<br />
            — <strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré<br />
            — <strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données<br /><br />
            Pour exercer ces droits, contactez-nous à privacy@configpc.ch. Nous répondrons dans un délai de 30 jours.
            En cas de litige, vous pouvez saisir le Préposé fédéral à la protection des données (PFPDT) en Suisse
            ou l&apos;autorité de contrôle compétente dans votre pays de résidence (CNIL pour la France).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Sécurité</h2>
          <p className="text-text-secondary leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
            contre tout accès non autorisé, modification, divulgation ou destruction. Toutes les communications entre
            votre navigateur et nos serveurs sont chiffrées via HTTPS/TLS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Modifications</h2>
          <p className="text-text-secondary leading-relaxed">
            Nous nous réservons le droit de modifier la présente politique à tout moment. Les modifications prennent
            effet dès leur publication sur cette page. Nous vous encourageons à consulter cette page régulièrement.
          </p>
        </section>

        <p className="text-text-secondary text-xs pt-4 border-t border-border">
          Dernière mise à jour : 1er avril 2026
        </p>
      </div>
    </main>
  );
}
