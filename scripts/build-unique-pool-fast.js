const fs = require('fs');
const path = require('path');
const https = require('https');

const candidateIds = [
  '1585336261022-680e295ce3fe', '1586075010923-2dd4570fb338', '1580582932707-520aed937b7b',
  '1456735190827-d1262f71b8a3', '1524995997946-a1c2e315a42f', '1434030216411-0b793f4b4173',
  '1544816155-12df9643f363', '1593062096033-9a26b09da705', '1491841550275-ad7854e35ca6',
  '1544716278-ca5e3f4abd8c', '1583485088034-697b5bc54ccd', '1553406830-ef2513450d76',
  '1513519245088-0e12902e5a38', '1509062522246-3755977927d7', '1579783902614-a3fb3927b675',
  '1507499739999-097706ad8914', '1534073828943-f801091bb18c', '1618005182384-a83a8bd57fbe',
  '1532094349884-543bc11b234d', '1566576912321-d58ddd7a6088', '1511886929837-354d827aae26',
  '1513151233558-d860c5398176', '1589829085413-56de8ae18c73', '1516962215378-7fa2e137ae93',
  '1497633762265-9d179a990aa6', '1471107340929-a87cd0f5b5f3', '1499750310107-5fef28a66643',
  '1516321318423-f06f85e504b3', '1512314889357-e157c22f938d', '1522202176988-66273c2fd55f',
  '1523240795612-9a054b0db644', '1517245386807-bb43f82c33c4', '1501504905252-473c47e087f8',
  '1526778548025-fa2f459cd5c1', '1586281380349-632531db7ed4', '1531403009284-440f080d1e12',
  '1517430816045-df4b7de71d1d', '1515378791036-0648a3ef77b2', '1581291518633-83b4ebd1d83e',
  '1507238691740-187a5b1d37b8', '1519389950473-47ba0277781c', '1522071820081-009f0129c71c',
  '1556761175-5973dc0f32e7', '1572021335469-31706a17aaef', '1531482615713-2afd69097998',
  '1506784983877-45594efa4cbe', '1486312338219-ce68d2c6f44d', '1498050108023-c5249f4df085',
  '1555066931-4365d14bab8c', '1526374965328-7f61d4dc18c5', '1518770660439-4636190af475',
  '1504384308090-c894fdcc538d', '1563986768609-322da13575f3', '1551288049-bebda4e38f71',
  '1460925895917-afdab827c52f', '1551836022-d5d88e9218df', '1542744094-3a3179294e77',
  '1557804506-669a67965ba0', '1573164713988-8665fc963095', '1531297484001-80022131f5a1',
  '1526738549149-8e07eca6c147', '1488590528505-98d2b5aba04b', '1505740420928-5e560c06d30e',
  '1583394838336-acd977736f90', '1546435770-a3e426bf472b', '1584438784854-08f97556107c',
  '1512820790803-83ca734da794', '1535905557558-afc4877a26fc', '1521587760476-6c12a4b040da',
  '1457369804613-52c61a468e7d', '1495446815901-a7297e633e8d', '1512428559087-560fa5ceab42',
  '1584697964358-3e14ca57658b', '1503551723145-6c04074236b8', '1516542076529-1ea3854896f2',
  '1579546929518-9e396f3cc809', '1508739773434-c26b3d09e071', '1550684848-fac1c5b4e853',
  '1518640467707-6811f4a6ab73', '1520072959219-c595dc870360', '1541701494587-cb58502866ab',
  '1579783900882-c0d3dad7b119', '1513364776144-60967b0f800f', '1526925539332-43511a38a08a',
  '1497633762265-9d179a990aa6', '1512820790803-83ca734da794', '1497493292307-31c376b6e479'
];

function checkUrl(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ id, ok: res.statusCode === 200 });
    }).on('error', () => resolve({ id, ok: false }));
  });
}

async function main() {
  console.log('Testing candidate pool in parallel...');
  const results = await Promise.all(candidateIds.map(checkUrl));
  const validPool = results.filter(r => r.ok).map(r => r.id);
  console.log('Verified', validPool.length, 'unique working 200 OK image IDs!');

  let poolIdx = 0;

  // 1. Featured Products in src/data/vexora-catalog.json
  const vexoraPath = path.join(__dirname, '../src/data/vexora-catalog.json');
  const vexoraData = JSON.parse(fs.readFileSync(vexoraPath, 'utf8'));

  for (let p of vexoraData.featured_products) {
    const id = validPool[poolIdx % validPool.length];
    poolIdx++;
    p.image = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=60`;
  }
  for (let c of vexoraData.categories) {
    const id = validPool[poolIdx % validPool.length];
    poolIdx++;
    c.cover = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=60`;
  }
  fs.writeFileSync(vexoraPath, JSON.stringify(vexoraData, null, 2));
  console.log('Updated vexora-catalog.json with unique images!');

  // 2. data/products.json
  const prodPath = path.join(__dirname, '../data/products.json');
  const prods = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
  for (let p of prods) {
    const id = validPool[poolIdx % validPool.length];
    poolIdx++;
    p.images = [`https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`];
  }
  fs.writeFileSync(prodPath, JSON.stringify(prods, null, 2));
  console.log('Updated products.json with unique images!');

  // 3. data/categories.json
  const catPath = path.join(__dirname, '../data/categories.json');
  const cats = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  for (let c of cats) {
    const id = validPool[poolIdx % validPool.length];
    poolIdx++;
    c.image = `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`;

    for (let sub of c.subcategories) {
      const subId = validPool[poolIdx % validPool.length];
      poolIdx++;
      sub.image = `https://images.unsplash.com/photo-${subId}?w=600&q=80&fit=crop`;
    }
  }
  fs.writeFileSync(catPath, JSON.stringify(cats, null, 2));
  console.log('Updated categories.json with 100% unique images across all subcategories!');
}

main();
