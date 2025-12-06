
utils = new Object();

Array.prototype.countIf = function (pred) {
    var count = 0;
    for (var i = 0; i < this.length; ++i)
        if (pred(this[i]))
            count++;
    return count;
}

Array.prototype.sortBy = function (keyFunc) {
    keys = this.map(a => [a, keyFunc(a)]);
    return keys.sort((a, b) => { return a[1] - b[1] }).map(a => a[0]);
}

Array.prototype.findIndices = function (keyFunc) {
    inds = []
    this.forEach((e, i) => {
        if (keyFunc(e))
            inds.push(i);
    })
    return inds;
}

Array.prototype.last = function (predFunc) {
    return this.reverse().find(predFunc)
}

Node.prototype.find = function (searchText) {
    return document.evaluate(`.//*[contains(text(), "${searchText}")]`, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

utils.getParents = function (node) {
    var nodes = []
    for (; node; node = node.parentNode) {
        nodes.push(node)
    }
    return nodes
}

utils.commonAncestor = function (node1, node2) {
    var parents1 = this.getParents(node1)
    var parents2 = this.getParents(node2)

    if (parents1[0] != parents2[0]) throw "No common ancestor!"

    for (var i = 0; i < parents1.length; i++) {
        if (parents1[i] != parents2[i]) return parents1[i - 1]
    }
}

utils.firstContainsInd = function (parents, child) {
    return parents.findIndex(p => p.contains(child));
}

utils.getContainsInds = function (parentElem, children) {
    return children.findIndices(c => parentElem.contains(c));
}

utils.findBestParent = function (elementsArr_) {
    max = 0;
    bestParent = null;
    elementsArr = [...elementsArr_];
    while (elementsArr.length > 1) {
        potentialParents = [];
        potParDepth = [];
        for (elem of elementsArr) {
            currParents = this.getParents(elem);
            pFoundInd = currParents.findIndex(p => this.getContainsInds(p, elementsArr).length > 1);
            potentialParents.push(currParents[pFoundInd]);
            potParDepth.push(currParents.length - pFoundInd);
        }

        newElementsArr = new Set();
        for ([elemI, par] of potentialParents.entries()) {
            potentialChildrenInd = this.getContainsInds(par, elementsArr);
            if (potentialChildrenInd.every(i => potParDepth[elemI] == potParDepth[i])) {
                if (potentialChildrenInd.length > max) {
                    max = potentialChildrenInd.length;
                    bestParent = par;
                }
                newElementsArr.add(par);
            } else {
                newElementsArr.add(elementsArr[elemI]);
            }
        }

        elementsArr = [...newElementsArr];
    }
    return bestParent;
}

utils.getViewportRect = function () {
    return new DOMRect(0, 0, window.innerWidth || document.documentElement.clientWidth, window.innerHeight || document.documentElement.clientHeight)
}

utils.isInViewport = function (element) {
    const rect = element.getBoundingClientRect();
    const viewportRect = this.getViewportRect();
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= viewportRect.bottom && rect.left <= viewportRect.right;
}

utils.stringToInt = function (s) {
    if (/^\d+$/.test(s)) {
        return parseInt(s);
    }
    return null;
}

utils.addStyle = function (styleStr) {
    styleElement = document.createElement("style");
    styleElement.innerHTML = styleStr
    document.head.appendChild(styleElement);
    // document.head.insertBefore(styleElement, document.head.firstChild);
}

utils.elementFromString = function (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

utils.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

utils.parseHTML = function (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

utils.waitFor = function (selectorOrXpath, callback = null) {
    // check if selector or xpath
    var selector;
    try {
        document.createDocumentFragment().querySelector(selectorOrXpath);
        selector = true;
    } catch {
        // not a valid selector, assume xpath
        selector = false;
    }
    function search(e) {
        if (selector) {
            if (e.matches && e.matches(selectorOrXpath)) {
                return e;
            } else if (e.querySelector) {
                return e.querySelector(selectorOrXpath);
            } else {
                return null;
            }
        } else {
            return document.evaluate(selectorOrXpath, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
    }

    return new Promise(resolve => {
        e = search(document);
        if (callback || !e) {
            const observer = new MutationObserver(mutations => {
                for (m of mutations) {
                    for (n of m.addedNodes) {
                        e = search(n);
                        if (e) {
                            if (callback) {
                                callback(e);
                            } else {
                                observer.disconnect();
                            }
                            resolve(e);
                        }
                    }
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
        if (e) {
            if (callback) {
                callback(e);
            }
            return resolve(e);
        }

    });
}


