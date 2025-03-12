const BaseXform = require('../base-xform');
const StaticXform = require('../static-xform');

const prestGeomJSON = {
  tag: 'a:prstGeom',
  $: {prst: 'rect'},
  c: [{tag: 'a:avLst'}],
};

class SpPrXfrom extends BaseXform {
  constructor() {
    super();

    this.map = {
      'a:prstGeom': new StaticXform(prestGeomJSON),
    };
  }

  get tag() {
    return 'xdr:spPr';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    const crop = model.crop || {};
    const rotate = crop.rotate || 0;

    xmlStream.openNode('a:xfrm', {rot: rotate});
    xmlStream.leafNode('a:off', {x: crop.x || 0, y: crop.y || 0});
    xmlStream.leafNode('a:ext', {cx: crop.width || 0, cy: crop.height || 0});
    xmlStream.closeNode();

    this.map['a:prstGeom'].render(xmlStream, model);
    xmlStream.closeNode();
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          crop: {
            rotate: 0,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
        };
        break;
      case 'a:xfrm':
        this.model.crop.rotate = Number(node.attributes.rot) || 0;
        break;
      case 'a:off':
        this.model.crop.x = Number(node.attributes.x) || 0;
        this.model.crop.y = Number(node.attributes.y) || 0;
        break;
      case 'a:ext':
        this.model.crop.width = Number(node.attributes.cx) || 0;
        this.model.crop.height = Number(node.attributes.cy) || 0;
        break;
      default:
        break;
    }
    return true;
  }

  parseText() {}

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        return false;
      default:
        return true;
    }
  }
}

module.exports = SpPrXfrom;
