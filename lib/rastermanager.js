/** Class manages the consumption and use of rasters */
import { Events } from './events';
class RasterManager {}

// who is currently rendering
let _raster;

// inflated representation of the components JSX
let _inflated = {};

// button tag count
let buttons = 0;

// set the raster to be used (dom, or wkwebview)
RasterManager.setRaster = raster => {
  _raster = raster;
};

// returns the current raster
RasterManager.getRaster = () => {
  return _raster;
};

// parses an ast tree from JSX syntax
const parseTree = ast => {
  // if a child is a class component, create an instance of it
  if (typeof ast.elementName == 'function') {
    ast.instance = new ast.elementName();
    ast.elementName = ast.instance.constructor.name;

    // a bit ugly need to clean up, how we access these props on the
    // definition vs the instance
    ast.props = ast.instance.props = ast.attributes;
    ast.instance.children = [];

    Events.register(ast.instance);
  }

  // go through it's children
  if (ast.children) {
    ast.children.forEach(function(element) {
      if (typeof element.elementName == 'function') {
        // create instances of the children
        element.instance = new element.elementName();
        // swap some stuff from the JSX ast
        element.elementName = element.instance.constructor.name;
        // pass down props
        element.instance.props = element.attributes;
        element.instance.elementName = element.elementName;
        if(element.elementName == 'Button') {
          // bind button clicks to the parent view
          element.instance.props.onPress = element.instance.props.onPress.bind(ast.instance);
          element.instance.tag = buttons * 1;
          buttons = buttons + 1;
        }

        // get next render level
        element.children = (element.instance.render && element.instance.render()) || element.children ;
        // add parent relationship for instances
        element.parent = ast.instance;
        Events.register(element.instance); // this is ugly
        ast.instance.children.push({guid: element.instance.guid, type: element.elementName});
      } else {
        // more to do with primative types
        if (typeof element != 'string') {
          element.props = element.attributes; // this fails on textnodes
        }
      }
    }, this);
  }
  return ast;
};

RasterManager.render = component => {
  // rudementary rendering
  if (typeof component == 'function') {
    // hasn't been inflated yet
    let c = new component();
    let baseAST = c.render();
    let parseAST = (_inflated[c.guid] = parseTree(baseAST));
    c.children = [{ guid: parseAST.instance.guid, type: parseAST.elementName }];
    parseAST.instance.parent = c;
    _raster.render(parseAST);
  } else {
    // re-rendering, dont diff, just inflate and substitute for now
    // TODO - this isn't really elegant with events, and will leak
    // needs fixing
    let parseAST = parseTree(component.render());
    let cacheid =
      _inflated[component.guid].instance &&
      _inflated[component.guid].instance.guid + '';
    parseAST.instance.guid = cacheid;
    delete _inflated[component.guid];
    _inflated[component.guid] = parseAST;
    parseAST.update = true;
    _raster.render(parseAST);
  }
};

// return raster manager
export { RasterManager };
