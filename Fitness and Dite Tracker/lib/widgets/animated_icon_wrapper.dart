import 'package:flutter/material.dart';

class AnimatedIconWrapper extends StatefulWidget {
  final Widget child;
  final bool continuous;
  final double scaleAmount;

  const AnimatedIconWrapper({
    super.key, 
    required this.child, 
    this.continuous = true,
    this.scaleAmount = 1.1,
  });

  @override
  State<AnimatedIconWrapper> createState() => _AnimatedIconWrapperState();
}

class _AnimatedIconWrapperState extends State<AnimatedIconWrapper> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: widget.scaleAmount), weight: 50),
      TweenSequenceItem(tween: Tween(begin: widget.scaleAmount, end: 1.0), weight: 50),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _rotationAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 0.1), weight: 25),
      TweenSequenceItem(tween: Tween(begin: 0.1, end: -0.1), weight: 50),
      TweenSequenceItem(tween: Tween(begin: -0.1, end: 0.0), weight: 25),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    if (widget.continuous) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _rotationAnimation.value,
          child: Transform.scale(
            scale: _scaleAnimation.value,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
