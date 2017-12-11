'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _inlineStylePrefixer = require('inline-style-prefixer');

var _inlineStylePrefixer2 = _interopRequireDefault(_inlineStylePrefixer);

var _reactStyleProptype = require('react-style-proptype');

var _reactStyleProptype2 = _interopRequireDefault(_reactStyleProptype);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';
var USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : DEFAULT_USER_AGENT;

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
var controlSnapTypes = {
  STEP: 'STEP',
  SIZE: 'SIZE',
  SIZE_ON_RELEASE: 'SIZE_ON_RELEASE'
};

var setStep = function setStep(stepSize) {
  return { type: controlSnapTypes.STEP, stepSize: stepSize };
};
var setSize = function setSize(size) {
  return { type: controlSnapTypes.SIZE, size: size };
};
var setSizeOnRelease = function setSizeOnRelease(size) {
  return {
    type: controlSnapTypes.SIZE_ON_RELEASE,
    size: size
  };
};

var SplitPane = function (_React$Component) {
  _inherits(SplitPane, _React$Component);

  function SplitPane() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SplitPane);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SplitPane.__proto__ || Object.getPrototypeOf(SplitPane)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      active: false,
      // resized: false,
      // startPositionLocal: this.props.defaultSize,
      startPosition: _this.props.defaultSize,
      sizeOnRelease: null,
      position: null,
      draggingDelta: null
      // jumpDirection: null,
    }, _this.onMouseDown = function (event) {
      event.preventDefault();
      var eventWithTouches = _extends({}, event, {
        touches: [{ clientX: event.clientX, clientY: event.clientY }]
      });
      _this.onClickDown(eventWithTouches);
    }, _this.onTouchStart = function (event) {
      event.preventDefault();
      _this.onClickDown(event);
    }, _this.onClickDown = function (event) {
      document.addEventListener('mouseup', _this.onMouseUp);
      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('touchmove', _this.onTouchMove);

      var _this$props = _this.props,
          allowResize = _this$props.allowResize,
          onDragStarted = _this$props.onDragStarted,
          split = _this$props.split,
          primary = _this$props.primary,
          defaultSize = _this$props.defaultSize;
      var _this$state = _this.state,
          startPosition = _this$state.startPosition,
          active = _this$state.active;

      var isVertical = split === 'vertical';

      if (allowResize) {
        unFocus(document, window);

        var position = isVertical ? event.touches[0].clientX : event.touches[0].clientY;

        var isPrimaryFirst = primary === 'first';

        if (!isPrimaryFirst) {
          var nodePane = _reactDom2.default.findDOMNode(_this.splitPane);
          var rect = nodePane.getBoundingClientRect();
          position = rect.x + rect.width - position;
        }

        if (typeof onDragStarted === 'function') {
          onDragStarted();
        }

        document.body.style.cursor = isVertical ? 'col-resize' : 'row-resize';

        _this.setState({
          active: true,
          position: position,
          // startPositionLocal: !active && !startPosition && defaultSize > 0 ? defaultSize : startPositionLocal,
          startPosition: !active && !startPosition && defaultSize > 0 ? defaultSize : startPosition
        });
      }
    }, _this.onMouseMove = function (event) {
      var eventWithTouches = _extends({}, event, {
        touches: [{ clientX: event.clientX, clientY: event.clientY }]
      });
      _this.onTouchMove(eventWithTouches);
    }, _this.onTouchMove = function (event) {
      var _this$props2 = _this.props,
          allowResize = _this$props2.allowResize,
          maxSize = _this$props2.maxSize,
          minSize = _this$props2.minSize,
          onChange = _this$props2.onChange,
          split = _this$props2.split,
          step = _this$props2.step,
          controlSnap = _this$props2.controlSnap,
          primary = _this$props2.primary;
      var _this$state2 = _this.state,
          active = _this$state2.active,
          position = _this$state2.position,
          startPosition = _this$state2.startPosition,
          draggingDelta = _this$state2.draggingDelta,
          jumped = _this$state2.jumped;


      if (allowResize && active) {
        unFocus(document, window);

        var isPrimaryFirst = primary === 'first';
        var ref = isPrimaryFirst ? _this.pane1 : _this.pane2;
        var ref2 = isPrimaryFirst ? _this.pane2 : _this.pane1;

        if (ref) {
          var node = _reactDom2.default.findDOMNode(ref);
          var node2 = _reactDom2.default.findDOMNode(ref2);
          var nodePane = _reactDom2.default.findDOMNode(_this.splitPane);
          // console.log("draggingDelta", \\\\)
          if (node.getBoundingClientRect) {
            // const width = node.getBoundingClientRect().width;
            // const height = node.getBoundingClientRect().height;

            var current = split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY;

            if (!isPrimaryFirst) {
              var rect = nodePane.getBoundingClientRect();
              current = rect.x + rect.width - current;
            }

            // const size = split === 'vertical' ? width : height;

            var positionDelta = position - current;
            var newPosition = position - positionDelta;

            var newSize = current;

            if (controlSnap) {
              var controlSnapResult = controlSnap({
                jumped: jumped,
                current: current,
                startPosition: startPosition,
                draggingDelta: draggingDelta,
                newPosition: newPosition,
                setSize: setSize,
                setSizeOnRelease: setSizeOnRelease,
                setStep: setStep
              });

              _this.state.draggingDelta = draggingDelta - positionDelta;

              if (controlSnapResult && controlSnapResult.constructor === Object) {
                if (controlSnapResult.type === controlSnapTypes.STEP) {
                  // TODO
                } else if (controlSnapResult.type === controlSnapTypes.SIZE_ON_RELEASE) {
                  _this.state.sizeOnRelease = controlSnapResult.size;
                } else if (controlSnapResult.type === controlSnapTypes.SIZE) {
                  if (controlSnapResult.size !== newSize) {
                    newSize = controlSnapResult.size;
                    _this.setState({
                      jumped: true,
                      startPosition: newSize,
                      sizeOnRelease: null
                    });
                  }
                } else {
                  _this.setState({
                    jumped: true,
                    sizeOnRelease: null
                  });
                }
              }
            }

            if (newSize < minSize) {
              newSize = minSize;
            } else if (maxSize !== undefined && newSize > maxSize) {
              newSize = maxSize;
            }

            if (newPosition !== _this.state.position) {
              _this.setState({
                position: newPosition
              });
            }

            _this.setRealSize(newSize);
          }
        }
      }
    }, _this.onMouseUp = function () {
      document.removeEventListener('mouseup', _this.onMouseUp);
      document.removeEventListener('mousemove', _this.onMouseMove);
      document.removeEventListener('touchmove', _this.onTouchMove);

      var _this$props3 = _this.props,
          allowResize = _this$props3.allowResize,
          onDragFinished = _this$props3.onDragFinished;
      var _this$state3 = _this.state,
          active = _this$state3.active,
          draggedSize = _this$state3.draggedSize,
          sizeOnRelease = _this$state3.sizeOnRelease;

      if (allowResize && active) {
        if (typeof onDragFinished === 'function') {
          onDragFinished(draggedSize);
        }

        document.body.style.cursor = '';

        if (_this.state.sizeOnRelease > 0) {
          _this.setRealSize(_this.state.sizeOnRelease);
        }

        _this.setState({
          active: false,
          jumped: false,
          draggingDelta: 0,
          sizeOnRelease: null
        });
      }
    }, _this.setRealSize = function (size) {
      if (_this.state.draggedSize === size) return;
      var _this$props4 = _this.props,
          primary = _this$props4.primary,
          onChange = _this$props4.onChange;

      var ref = primary === 'first' ? _this.pane1 : _this.pane2;
      if (ref) {
        if (onChange) onChange(size);
        _this.setState({ draggedSize: size });
        ref.setState({ size: size });
      }
    }, _this.classNameWithState = function (className) {
      var active = _this.state.active;

      if (!active) return '';
      return className + '--active';
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SplitPane, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setSize(this.props, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.setSize(props, this.state);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'setSize',
    value: function setSize(props, state) {
      var newSize = props.size || state && state.draggedSize || props.defaultSize || props.minSize;
      if (newSize === state.draggedSize) return;

      var primary = this.props.primary;

      var ref = primary === 'first' ? this.pane1 : this.pane2;
      if (ref) {
        ref.setState({
          size: newSize
        });
        this.setState({
          draggedSize: newSize
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          allowResize = _props.allowResize,
          children = _props.children,
          className = _props.className,
          defaultSize = _props.defaultSize,
          minSize = _props.minSize,
          onResizerClick = _props.onResizerClick,
          onResizerDoubleClick = _props.onResizerDoubleClick,
          paneClassName = _props.paneClassName,
          pane1ClassName = _props.pane1ClassName,
          pane2ClassName = _props.pane2ClassName,
          paneStyle = _props.paneStyle,
          pane1StyleProps = _props.pane1Style,
          pane2StyleProps = _props.pane2Style,
          primary = _props.primary,
          prefixer = _props.prefixer,
          resizerClassName = _props.resizerClassName,
          resizerStyle = _props.resizerStyle,
          size = _props.size,
          split = _props.split,
          styleProps = _props.style;
      var active = this.state.active;

      var disabledClass = allowResize ? '' : 'disabled';
      var resizerClassNamesIncludingDefault = resizerClassName ? resizerClassName + ' ' + this.classNameWithState(resizerClassName) + ' ' + _Resizer.RESIZER_DEFAULT_CLASSNAME + ' ' + this.classNameWithState(_Resizer.RESIZER_DEFAULT_CLASSNAME) : _Resizer.RESIZER_DEFAULT_CLASSNAME + ' ' + this.classNameWithState(_Resizer.RESIZER_DEFAULT_CLASSNAME);

      var style = _extends({}, {
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'absolute',
        outline: 'none',
        overflow: 'hidden',
        MozUserSelect: 'text',
        WebkitUserSelect: 'text',
        msUserSelect: 'text',
        userSelect: 'text'
      }, styleProps || {});

      if (split === 'vertical') {
        _extends(style, {
          flexDirection: 'row',
          left: 0,
          right: 0
        });
      } else {
        _extends(style, {
          bottom: 0,
          flexDirection: 'column',
          minHeight: '100%',
          top: 0,
          width: '100%'
        });
      }

      var classes = ['SplitPane', className, split, disabledClass];
      var pane1Style = prefixer.prefix(_extends({}, paneStyle || {}, pane1StyleProps || {}));
      var pane2Style = prefixer.prefix(_extends({}, paneStyle || {}, pane2StyleProps || {}));

      var pane1Classes = ['Pane1', paneClassName, pane1ClassName].join(' ');
      var pane2Classes = ['Pane2', paneClassName, pane2ClassName].join(' ');

      return _react2.default.createElement(
        'div',
        {
          className: classes.join(' '),
          ref: function ref(node) {
            _this2.splitPane = node;
          },
          style: prefixer.prefix(style)
        },
        _react2.default.createElement(
          _Pane2.default,
          {
            className: pane1Classes,
            key: 'pane1',
            ref: function ref(node) {
              _this2.pane1 = node;
            },
            size: primary === 'first' ? size || defaultSize || minSize : undefined,
            split: split,
            style: pane1Style
          },
          children[0]
        ),
        _react2.default.createElement(_Resizer2.default, {
          className: disabledClass,
          onClick: onResizerClick,
          onDoubleClick: onResizerDoubleClick,
          onMouseDown: this.onMouseDown,
          onTouchStart: this.onTouchStart,
          onTouchEnd: this.onMouseUp,
          key: 'resizer',
          ref: function ref(node) {
            _this2.resizer = node;
          },
          resizerClassName: resizerClassNamesIncludingDefault,
          split: split,
          style: resizerStyle || {}
        }),
        _react2.default.createElement(
          _Pane2.default,
          {
            className: pane2Classes,
            key: 'pane2',
            ref: function ref(node) {
              _this2.pane2 = node;
            },
            size: primary === 'second' ? size || defaultSize || minSize : undefined,
            split: split,
            style: pane2Style
          },
          children[1]
        )
      );
    }
  }]);

  return SplitPane;
}(_react2.default.Component);

SplitPane.propTypes = {
  allowResize: _propTypes2.default.bool,
  children: _propTypes2.default.arrayOf(_propTypes2.default.node).isRequired,
  className: _propTypes2.default.string,
  primary: _propTypes2.default.oneOf(['first', 'second']),
  minSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  maxSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  // eslint-disable-next-line react/no-unused-prop-types
  defaultSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  split: _propTypes2.default.oneOf(['vertical', 'horizontal']),
  onDragStarted: _propTypes2.default.func,
  onDragFinished: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onResizerClick: _propTypes2.default.func,
  onResizerDoubleClick: _propTypes2.default.func,
  prefixer: _propTypes2.default.instanceOf(_inlineStylePrefixer2.default).isRequired,
  style: _reactStyleProptype2.default,
  resizerStyle: _reactStyleProptype2.default,
  paneClassName: _propTypes2.default.string,
  pane1ClassName: _propTypes2.default.string,
  pane2ClassName: _propTypes2.default.string,
  paneStyle: _reactStyleProptype2.default,
  pane1Style: _reactStyleProptype2.default,
  pane2Style: _reactStyleProptype2.default,
  resizerClassName: _propTypes2.default.string,
  step: _propTypes2.default.number
};

SplitPane.defaultProps = {
  allowResize: true,
  minSize: 50,
  prefixer: new _inlineStylePrefixer2.default({ userAgent: USER_AGENT }),
  primary: 'first',
  split: 'vertical',
  paneClassName: '',
  pane1ClassName: '',
  pane2ClassName: ''
};

exports.default = SplitPane;
module.exports = exports['default'];