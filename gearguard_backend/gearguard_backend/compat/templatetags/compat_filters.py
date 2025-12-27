from django import template

register = template.Library()


@register.filter(name="length_is")
def length_is(value, arg):
    """Backward-compatible length_is filter used by third-party templates."""
    try:
        return len(value) == int(arg)
    except (TypeError, ValueError):
        return False
